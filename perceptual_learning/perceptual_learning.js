/******************************************************************************/
/*** Preamble *****************************************************************/
/******************************************************************************/

/*
The experiment features two main trial types - picture selection (which is where
we present ambiguous sounds to alter people's phoneme boundary) and phoneme categorization
(where we test whether we have shifted their boundary).
Picture selection: hear a noun phrase plus two pictures, click on a picture
Phoneme categorization: hear a word, click on a button indicating if it was teen or dean.
*/

/******************************************************************************/
/*** Social network questionnaire *********************************************/
/******************************************************************************/

/*
A partial implementation of the questions given at https://doi.org/10.1371/journal.pone.0183593.s005.
Fairly straightforward use of the survey-html-form plugin - note that all the
inputs are set to required.
 */

 var social_network_questionnaire = {
   type: 'survey-html-form',
   preamble: "<p style='text-align:left'> <b>Social network questionnaire</b></p>\
              <p style='text-align:left'> In this questionnaire we would like to \
              gather information about your linguistic interactions. We realize \
              that some of the estimates are difficult to make. Please do your \
              best and be as accurate as possible.</p> \
              <p style='text-align:left'> Important: When providing estimates for \
              your exposure in a week, keep in mind that your habits may vary \
              considerably depending on the day of the week (e.g., weekday vs. weekend). \
              Please be as accurate as possible and do not simply multiply your \
              estimate for one day by 7.</p>",
   html:"<p style='text-align:left'>How old are you? <br> \
              <input required name='age' type='number'></p> \
         <p style='text-align:left'>With how many people do you converse orally \
         in a typical week? (Please only include people with whom you regularly \
           talk for longer than 5 minutes)<br> \
              <input required name='n_speak_to' type='number'></p> \
           <p style='text-align:left'>How many hours do you usually spend on \
           conversing orally with people in a typical week?<br>\
              <input required name='hours_speak_to' type='number'></p>"
 };


/******************************************************************************/
/*** Picture selection trials *************************************************/
/******************************************************************************/

/*
Picture selection: hear a noun phrase plus two pictures, click on a picture
*/

/*
make_image_selection_stimulus takes the base name of the sound file to present,
true/false for whether to use the manipulated audio version, and then the base
names of the target and foil pictures. It works out the path and full filename for
the audio file, and then returns a dictionary containing that stimulus plus the
two images as choices, which will be used in an audio_button_response trial.
*/
function make_image_selection_stimulus(sound,manipulated,target_image,foil_image) {
  if (manipulated) {
    //manipulated files have "_man" (for manipulated) stuck on the end of the file name
    var sound_file = "picture_selection_sounds/" + sound + "_man.mp3"
  }
  else {
    var sound_file = "picture_selection_sounds/" + sound + ".mp3"
  }
  var stim = {stimulus:sound_file,
              choices:[target_image,foil_image]}
  return stim
}


/*
Using make_image_selection_stimulus to make a short list of picture selection trials
*/
var selection_stim_list = [make_image_selection_stimulus("fresh_dill",true,"fresh_dill","dry_dill"),
                           make_image_selection_stimulus("orange_telephone",false,"orange_telephone","black_telephone"),
                           make_image_selection_stimulus("angel_wing",false,"angel_wing","airplane_wing"),
                           make_image_selection_stimulus("animal_ear",false,"animal_ear","animal_nose")]


/*
Now we plug selection_stim_list into the audio-button-response plugin as a nested
timeline, with order randomised.

We use button_html to use the choices as the names of image files, resulting in buttons
which are images.

The left-right order of the buttons is randomised at the start of each trial, and
we record that randomisation order in trial data. Then at the end of the trial we
figure out which image was selected, and also use savePerceptualLearningDataLine
to save the trial data.
*/
var selection_trials = {type:'audio-button-response',
                        timeline: jsPsych.randomization.shuffle(selection_stim_list), //shuffle
                        button_html: '<button class="jspsych-btn"> <img src="picture_selection_images/%choice%.jpg" width=250px></button>',
                        post_trial_gap: 500, //a little pause between trials
                        on_start: function(trial) {
                            var shuffled_label_choices = jsPsych.randomization.shuffle(trial.choices)
                            trial.choices = shuffled_label_choices
                            trial.data = {button_choices:shuffled_label_choices}
                        },
                         on_finish: function(data) {
                            var button_number = data.button_pressed
                            data.button_selected = data.button_choices[button_number]
                            savePerceptualLearningDataLine(data) //save the trial data
                          }
                        }




/******************************************************************************/
/*** Phoneme categorization trials ********************************************/
/******************************************************************************/

/*
Very similar to the process of building the picture selection trials, the only
differences being that the choices are always the same (dean vs teen) and the
order of the buttons is not randomised.
*/

var categorization_stim_list = [{stimulus:'phoneme_categorization_sounds/samespeaker_VOT5.mp3'},
                                {stimulus:'phoneme_categorization_sounds/samespeaker_VOT10.mp3'},
                                {stimulus:'phoneme_categorization_sounds/samespeaker_VOT15.mp3'},
                                {stimulus:'phoneme_categorization_sounds/samespeaker_VOT20.mp3'},
                                {stimulus:'phoneme_categorization_sounds/samespeaker_VOT25.mp3'},
                                {stimulus:'phoneme_categorization_sounds/samespeaker_VOT30.mp3'},
                                {stimulus:'phoneme_categorization_sounds/samespeaker_VOT50.mp3'},
                                {stimulus:'phoneme_categorization_sounds/samespeaker_VOT80.mp3'}] 

var categorization_trials = {type:'audio-button-response',
                              choices:['dean','teen'],
                              post_trial_gap: 500,
                              timeline:jsPsych.randomization.shuffle(categorization_stim_list),
                              on_start: function(trial) {
                                  trial.data = {button_choices:trial.choices}
                              },
                              on_finish: function(data) {
                                var button_number = data.button_pressed
                                data.button_selected = data.button_choices[button_number]
                                savePerceptualLearningDataLine(data)
                              }}



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

var instruction_screen_picture_selection = {
  type: 'html-keyboard-response',
  stimulus: "<h3>Picture Selction Instructions</h3>\
  <p>Instructions for the picture selection stage.</p>\
  <p>Press any key to begin</p>"
}

var instruction_screen_phoneme_categorization = {
  type: 'html-keyboard-response',
  stimulus: "<h3>Phoneme Categorization Instructions</h3>\
  <p>Instructions for the phoneme categorization phase.</p>\
  <p>Press any key to begin</p>"
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
/*** Build the timeline *******************************************************/
/******************************************************************************/

/*
I am using concat here to make sure the timeline is a flat list as per the word learning experiment.
*/
var full_timeline = [].concat(consent_screen,
                              social_network_questionnaire,
                              instruction_screen_picture_selection,
                              selection_trials,
                              instruction_screen_phoneme_categorization,
                              categorization_trials,
                              final_screen)


/******************************************************************************/
/*** Saving data trial by trial ***********************************************/
/******************************************************************************/

/*
This is the saveData function provided in Alisdair's tutorial, section 06. In the
word learning experiment we used this function to save all the trial data at once,
but we can also use it to save data incrementally by calling it from savePerceptualLearningDataLine.
*/
function saveData(name, data_in){
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
This is a slightly modification to Alisdair's saveDataLine code.
*/
function savePerceptualLearningDataLine(data) {
    // choose the data we want to save - this will also determine the order of the columns
    var data_to_save = [
        data.trial_index,data.time_elapsed,
        data.stimulus, data.button_choices,data.button_selected,
        data.button_pressed,data.rt];
    // join these with commas and add a newline
    var line = data_to_save.join(',')+"\n";
    saveData('perceptuallearning_data.csv', line);
}

/******************************************************************************/
/*** Run the timeline *******************************************************/
/******************************************************************************/

/*
As usual, we will dump all the trials on-screen at the end so you can see what's
going on. Note that data on critical trials is saved trial-by-trial as the experiment
runs, so I have removed the code here to save all the data at the end of the experiment.
*/
jsPsych.init({
    timeline: full_timeline,
    on_finish: function(){
      jsPsych.data.displayData('csv') //and also dump *all* the data to screen
    }
});
