/******************************************************************************/
/*** Preamble *****************************************************************/
/******************************************************************************/

/*
Participants alternate between two trial types:
Picture selection trials, where they hear audio from their partner (in fact recorded
audio from our confederate) and select the matching picture from an array of 4
Picture description trials, where they see a picture and produce a description for
their partner using a given verb (clicking a mic icon to start and stop recording)
We also simulate the confederate preparing to speak and making a selection based on
the participant's productions by inserting variable "waiting for partner" screens.

We are interested in whether, on critical trials featuring a ditransitive event,
the construction used in the description on the picture selecvtion trial (PO or DO)
influences the description the participant produces on the immediately following
picture description trial.

The picture selection trials work in essentially the same was as picture selection
trials in the perceptual learning experiment.

Picture description trials are a series of image-button-response trials, with
some additional infrastructure to handle recording audio.

NB The code for audio recording was developed in conjunction with Annie Holz, and
ias adapted from the demo at https://experiments.ppls.ed.ac.uk/.
*/

/******************************************************************************/
/*** Infrastructure for recording audio ***************************************/
/******************************************************************************/

/*
Capturing audio in javascript is actually fairly straightforward thanks to the
getUserMedia and MediaRecorder functions. We want to create a single MediaRecorder
which we use throughout the experiment, so the participant doesn't have to grant
microphone access repeatedly.
*/

/*
Rather than clutter up this file with the code for handling audio, I have put it
in a seperate js file, which is loaded by the top html page in the same way as this
file - this other file is called confederate_priming_utilities.js, and includes
the audio recording code. That code creates several global variables and functions
which are used in recording audio - the only ones you have to worry about when
reading this code are:

recording_counter - just a counter where we keep track of how many audio recordings
we have made - the first recording is 0, the second 1 etc. We use these in the filenames
of recordings and also in the CSV data saved on the server so you can link particular
recordings to particular experiment trials.

request_mic_access() - this tries to create the various media and recorder objects we
need to record audio, and will prompt the participant for mic access via a pop-up.

start_recording(filename_prefix) starts audio recording, the audio will be saved
to a file called filename_prefix_recording_counter.webm when the recording is stopped.

stop_recording() stops the current audio recording, triggering saving of the audio file,
and also increments the recording_counter
*/


/******************************************************************************/
/*** Saving data trial by trial ***********************************************/
/******************************************************************************/

/*
The usual code for saving data to the server.
*/
function save_data(name, data_in){
  var url = 'save_data.php';
  var data_to_send = {filename: name, filedata: data_in};
  fetch(url, {
      method: 'POST',
      body: JSON.stringify(data_to_send),
      headers: new Headers({
              'Content-Type': 'application/json'
      })
  });
}


/*
This is a slightly modification to Alisdair's saveDataLine code. Note that data is
save to a file named cp_ID.csv, where cp stands for confederate priming and ID is
the randomly-generated participant ID.
*/
function save_confederate_priming_data(data) {
  // choose the data we want to save - this will also determine the order of the columns
  var data_to_save = [
      participant_id,
      data.trial_index,
      data.trial_type,
      data.recording_counter,
      data.time_elapsed,
      data.stimulus, data.button_choices,data.button_selected,
      data.button_pressed,data.rt];
  // join these with commas and add a newline
  var line = data_to_save.join(',')+"\n";
  save_data('cp_' + participant_id + '.csv', line);
}



/******************************************************************************/
/*** Generate a random participant ID *****************************************/
/******************************************************************************/

/*
We'll generate a random participant ID when the experiment starts, and use this
to save a seperate set of data files per participant.
*/

var participant_id = jsPsych.randomization.randomID(10);

/******************************************************************************/
/*** Random waits, flipping images ***************************************************/
/******************************************************************************/

/*
At several points in the code we want to generate a random wait, to simulate the
confederate participant pondering what to say or hunting for the correct image.
The random_wait function below will return a number between 1000 and 3000, which
be used as the delay (in milliseconds) on screens where the "waiting for partner"
message appears.
*/

function random_wait() {
  return 1000+(Math.floor(Math.random() * 2000))
}

/*
The images folder contains two versions of each image - the orientation they were
drawn in, and then a reversed image where the image is flipped on its horizontal
axis - the two images have the same name except that the reversed image has "_r"
added at the end. Since the order the characters and objects appear in a scene might
influence how people talk about them, we want to randomise this whenever these images
appear, which is done by this random_image_flip function, which takes an image name
and either returns that image name or the reversed version, by adding "_r" to the
end of the image name.
*/
function random_image_flip(image_name) {
  var image_affixes = ["","_r"]
  var selected_affix = jsPsych.randomization.shuffle(image_affixes)[0]
  var new_image_name = image_name + selected_affix
  return new_image_name
}

/******************************************************************************/
/*** Picture selection trials *************************************************/
/******************************************************************************/

/*
Picture selection: wait while the confederate prepares to click their mic button
(in reality, a random duration wait), then hear a description from the confederate
plus four pictures, then click on a picture.

make_picture_selection_trial takes the base name of the sound file to present,
and the base names of the target and foil pictures. It works out the path and full filename for
the audio file, and randomly flips some of the images to use the reversed images
(which just involves adding "_r" to the image name) then builds a 2-part trial (using a nested timeline): a simple
waiting message (simulating the confederate pondering before they click the mic and
start talking) then an audio-button-response trial where the participant listens
to the confederate audio and makes a selection. The function returns this trial object.
*/
function make_picture_selection_trial(sound,images) {
  var sound_file = "sounds/" + sound + ".mp3"
  var image_choices = []
  for (image of images) {
    image_choices.push(random_image_flip(image))
  }
  //simple waiting message
  var waiting_for_partner = {type:'html-keyboard-response',
                             stimulus:"Waiting for partner to speak",
                             choices:[],
                             trial_duration:function() {return random_wait()}}
  //audio trial
  var selection_trial = {type:'audio-button-response',
                         stimulus:sound_file,
                         choices:image_choices,
                         button_html: '<button class="jspsych-btn"> <img src="images/%choice%.jpg" width=250px></button>',
                         post_trial_gap: 500, //a little pause after the participant makes their choice
                         on_start: function(trial) {
                              var shuffled_label_choices = jsPsych.randomization.shuffle(trial.choices)
                              trial.choices = shuffled_label_choices
                              trial.data = {button_choices:shuffled_label_choices}
                          },
                         on_finish: function(data) {
                              var button_number = data.button_pressed
                              data.button_selected = data.button_choices[button_number]
                              data.trial_type = 'picture_selection'
                              save_confederate_priming_data(data) //save the trial data
                            }
                          }
  var full_trial = {timeline:[waiting_for_partner,selection_trial]}
  return full_trial
}


/******************************************************************************/
/*** Picture description trials ********************************************/
/******************************************************************************/

/*
Picture description: see the picture to be described plus the verb to use, click
on the mic icon to begin recording a description, then click on the mic icon to
stop recording, then finally wait while the confederate
prepares completes the picture selection task (in reality, a random duration wait).

make_picture_description_trial takes the name of the image to present, plus
the verb to give the participant, plus the prefix of the file to save the audio to,
and constructs a 3-part trial (using a nested timeline). The 3 parts are:
1. Show the image plus white mic button. When the participant clicks the mic button,
  we move on to 2.
2. Change mic orange and start recording audio (using the on_start property). When
  the participant clicks the mic button again, stops recording audio (using the
  on_finish property).
3. Show a waiting for partner message.

As for picture selection, the target image has a change of being presented as the
reversed image, again using random_image_flip.
*/

function make_picture_description_trial(target_image,verb) {
  var target_image_flipped = random_image_flip(target_image)
  var picture_plus_white_mic = {type:'image-button-response',
                                stimulus:"images/"+target_image_flipped+".jpg",
                                stimulus_width: 500,
                                prompt:verb,
                                choices:['mic'],
                                button_html:'<button class="jspsych-btn" style="background-color: white;"> <img src="mic_images/%choice%.png" width=75px></button>'}
  var picture_plus_orange_mic = {type:'image-button-response',
                                 stimulus:"images/"+target_image_flipped+".jpg",
                                 stimulus_width: 500,
                                 choices:['mic'],
                                 prompt:verb,
                                 button_html:'<button class="jspsych-btn" style="background-color: Darkorange;"> <img src="mic_images/%choice%.png" width=75px></button>',
                                 on_start: function(trial) {
                                   start_recording(participant_id)},
                                 on_finish: function(data) {
                                   data.recording_counter = recording_counter
                                   stop_recording()
                                   data.trial_type = 'picture_description'
                                   save_confederate_priming_data(data)}
                                 }
  var waiting_for_partner = {type:'html-keyboard-response',
                             stimulus:"Waiting for partner to select",
                             choices:[],
                             trial_duration: function() {return random_wait()},
                             post_trial_gap: 500} //short pause after the confederate makes their selection
  var full_trial = {timeline:[picture_plus_white_mic,
                              picture_plus_orange_mic,
                              waiting_for_partner]}
  return full_trial
}



/******************************************************************************/
/*** Instruction trials *******************************************************/
/******************************************************************************/

/*
As usual, your experiment will need some instruction screens.
*/

var consent_screen = {
  type: 'html-button-response',
  stimulus: "<h3>Welcome to the experiment</h3> \
  <p style='text-align:left'>Experiments begin with an information sheet that explains to the participant \
  what they will be doing, how their data will be used, and how they will be \
  remunerated.</p> \
  <p style='text-align:left'>This is a placeholder for that information, which is normally reviewed \
  as part of the ethical review process.</p>",
  choices: ['Yes, I consent to participate'],
}

var instruction_screen = {
  type: 'html-keyboard-response',
  stimulus: "<h3>Instructions</h3>\
  <p style='text-align:left'>Instructions. NB for an audio experiment, where you are requesting mic access, \
  you will need to provide detailed instructions for the participant.</p>\
  <p>Press any key to begin</p>"
}

var audio_permission_instructions1 = {
  type: 'html-keyboard-response',
  stimulus: "<h3>Permission to access your microphone</h3>\
  <p style='text-align:left'>In this experiment you will be interacting with another participant. \
  You will be recording audio descriptions using your microphone, and listening to \
  descriptions your partner has recorded.</p>\
  <p style='text-align:left'><b>On the next screen we will ask for permission to access your microphone</b>. \
  When the pop-up appears asking for permission to access your microphone, please grant \
  access, otherwise the experiment won't work. </p>\
  <p style='text-align:left'>We will only record when you click the record button - you are always in control.</p> \
  <p>Press any key to continue.</p>",
  on_finish:function() {request_mic_access()}
}

var audio_permission_instructions2 = {
  type: 'html-keyboard-response',
  stimulus: "<h3>Grant permission to access your microphone</h3>\
  <p style='text-align:left'>Please grant us permission to access you microphone in the pop-up, then \
  press any key to continue.</p>"
}


var final_screen = {
  type: 'html-keyboard-response',
  stimulus: "<h3>Finished!</h3>\
  <p>Experiments often end with a final screen, e.g. that contains a completion \
  code so the participant can claim their payment.</p>\
  <p>This is a placeholder for that information.</p>\
  <p>Press any key to finish the experiment and see your raw data. Critical trial data was \
  also saved to server_data trial-by-trial.</p>"}


/******************************************************************************/
/*** Reading the trial list from a CSV file ***********************************/
/******************************************************************************/

/*
This function reads the trial list provided in triallist_filename and converts it
to a series of jsPsych trials. Since reading the CSV file takes some time (it involves
a fetch call to read the CSV file on the server), we have to use the async and await
functions to ensure that the CSV file has been read before we start processing it.
We then use process_data to turn a text representation of the contents of the CSV file
into a more usable javascript representation, and then build_timeline turns that
into a list of jsPsych trials. Finally we use build_button_image_preload_list to
build our image preload list, and then add instructions etc to produce the full timeline.
*/
async function read_trials_and_prepare_timeline(triallist_filename) {
  var response = await fetch(triallist_filename)
  var csv_as_text = await response.text()
  var trial_list = process_data(csv_as_text)
  var interaction_trials = build_timeline(trial_list)
  var button_image_preload_list = build_button_image_preload_list(interaction_trials)
  var full_timeline = [].concat(consent_screen,instruction_screen,
                                audio_permission_instructions1,
                                audio_permission_instructions2,
                                interaction_trials,
                                final_screen)
  jsPsych.init({
      preload_images: button_image_preload_list,
      timeline: full_timeline,
      on_finish: function(){
        jsPsych.data.displayData('csv') //and also dump *all* the data to screen
      }
  });

}

/*
process_data takes a CSV file which has been read as a series of strings seperated by
commas and newlines and turns it into an array of javascript objects, where the column
headers in the CSV file become the parameters of the javascript objects, one object
per line in the CSV file. For example, the CSV file:

column1_title,column2_title
row1_data1,row1_data2
row2_data1,row2_data2

becomes
[
{column1_title:row1_data1,column2_title:row1_data2},
{column1_title:row2_data1,column2_title:row2_data2},
]

NB this code is based on https://stackoverflow.com/questions/7431268/how-to-read-data-from-csv-file-using-javascript
*/
function process_data(rawData) {
  var rawDataLines = rawData.split(/\r\n|\n/);
  var headers = rawDataLines[0].split(',');
  var lines = [];
  for (var i=1; i<rawDataLines.length; i++) {
      var data = rawDataLines[i].split(',');
      if (data.length == headers.length) {
          var trialObject = {};
          for (var j=0; j<headers.length; j++) {
            trialObject[headers[j]]=data[j]
            }
          }
          lines.push(trialObject);
      }
  return lines
}

/*
build_timeline takes a trial list read from a CSV and uses make_picture_selection_trial
and make_picture_description_trial to convert each row of that CSV file into a pair
of jsPsych trials, reading the relevant info from the appropriate columns in the CSV
data structure.
*/
function build_timeline(trial_list) {
  var interaction_trials = []
  for (trial of trial_list) {
    var prime_trial = make_picture_selection_trial(trial.confederateSentence,
                                                   [trial.matcherArray1,
                                                    trial.matcherArray2,
                                                    trial.matcherArray3,
                                                    trial.matcherArray4])
    var test_trial = make_picture_description_trial(trial.participantImage,trial.participantVerb)
    interaction_trials.push(prime_trial)
    interaction_trials.push(test_trial)
  }

  return interaction_trials

}

/*
This function simply wraps up the process of building the image preload list as
a function.
*/

function build_button_image_preload_list(interaction_trials) {
  var button_images_list = []
  for (trial of interaction_trials) {
    var trial_embedded_timeline = trial.timeline
    for (subtrial of trial_embedded_timeline) {
      if (subtrial.type=='audio-button-response') {
        var image_choices = subtrial.choices
        for (image of image_choices) {
          var full_image_name = "images/" + image + ".jpg"
          button_images_list.push(full_image_name)
        }
      }
    }
  }
  return button_images_list
}

/*
Finally, run the code to read the trial list and start the experiment - I have
provided two trial lists, alternating_ns_confederate.csv (a native English speaking
confederate who alternates PO and DO) and doonly_ns_confederate.csv (a native English speaking
confederate who uses DO only)
*/
read_trials_and_prepare_timeline("trial_lists/alternating_ns_confederate.csv")
