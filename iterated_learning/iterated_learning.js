/******************************************************************************/
/*** Preamble ************************************************/
/******************************************************************************/

/*
This experiment is an iterated artificial language learning experiment, similar
to the one reported in Beckner et al. (2017) (but with different stimuli and a
modified production process, involving buttons rather than free typing).

The experiment features two main phases - observation (training) and production.

The observation trials are based on the code from word_learning.js, covered earlier
in the course.
Production trials involve a new custom plug-in (based on image-button-response)
allowing participants to produce a complex label with a series of button clicks.

The iteration process is managed by a series of php scripts:
When the experiment opens, we look in server_data/il/ready_to_iterate for CSV files
to use as an input language.
If there is at least one such file, we select one, read in the input langage from it,
and move the file to server_data/il/undergoing_iteration (so that no other participants
start working on the same file)
If the participant completes the experiment, we move their input language file to
server_data/il/completed_iteration, and save the language they produced during the
production phase to server_data/il/ready_to_iterate (so it can be used as input to
the next participant).
If the participant abandons the experiment, we move their input language file back
to server_data/il/ready_to_iterate so it becomes available for another participant
to use.
*/

/******************************************************************************/
/*** Generate a random participant ID *****************************************/
/******************************************************************************/

/*
We'll generate a random participant ID when the experiment starts, and use this
to save a seperate set of data files per participant.
*/

var participant_id = jsPsych.randomization.randomID(10);


/******************************************************************************/
/*** Saving data trial by trial ***********************************************/
/******************************************************************************/

/*
Change this to match *your* UUN so that data is saved in your server_data folder
rather than mine.
*/
var myUUN = 'ksmith7'

/*
This is a modified version of our usual save_data function - it appends data to
filename in directory on /home/myUUN/server_data/il/
*/
function save_data(directory,filename,data){
  var url = 'save_data.php';
  var data_to_send = {user: myUUN, directory: directory, filename: filename, filedata: data};
  fetch(url, {
      method: 'POST',
      body: JSON.stringify(data_to_send),
      headers: new Headers({
              'Content-Type': 'application/json'
      })
  });
}

/*
As in previous weeks, we select the trial data we want to save then save it using
save_data (saving to server_data/il/participant_data). The file name is based on
a standard format, il_ID_chainX_gY.csv, where ID is the participant ID, X is the
chain number, Y is the generation number.
*/
function save_iterated_learning_data(data) {
  // choose the data we want to save - this will also determine the order of the columns
  var data_to_save = [
      participant_id,
      chain,
      generation,
      data.trial_index,
      data.block,
      data.time_elapsed,
      data.stimulus,
      data.label];
  // join these with commas and add a newline
  var line = data_to_save.join(',')+"\n";
  //build filename using the participant_id, chain and generation global variables
  var filename = 'il_' + participant_id + '_chain' + chain + '_g' + generation + '.csv'
  //save to participant_data folder
  save_data('participant_data', filename, line);
}


/******************************************************************************/
/*** Listing, reading and saving language files *******************************/
/******************************************************************************/

/*
We need various functions which call PHP scripts which interact with saved language
files - this is how we read in a previous participant's language to use as input,
and save the current participant's output language to use as input for others.

Language files are simply CSV files with two names columns, object (giving the image
file) and label (giving the label for that object in the language).

All of these files as async, since there will be a short delay as we wait for the
PHP script to read/write files on the server.
*/

/*
list_input_languages() uses list_input_languages.php to return a list of files in
server_data/il/ready_to_iterate - these are candidate input languages which can be
used for iteration.
*/

async function list_input_languages(){
  var data_to_send = {user: myUUN}; //we need to send over myUUN so the PHP looks in the correct user directory
  var response = await fetch('list_input_languages.php', {
      method: 'POST',
      body: JSON.stringify(data_to_send),
      headers: new Headers({
              'Content-Type': 'application/json'})});
  // various steps to convert the string returned by the PHP script into
  // something we can work with
  var text_response = await response.text()
  var object_response = JSON.parse(text_response)
  var language_file_list = Object.values(object_response)
  return language_file_list
}


/*
Once we have selected an input language file, we need to read it in. This is handled
by load_input_language.php - we simply convert the object is sends over to a usable
array of objects using JSON.stringify.
*/

async function read_input_language(input_language_filename){
  var data_to_send = {user:myUUN,filename: input_language_filename}; //we need to send myUUN and input_language_filename to the PHP script
  var response = await fetch('load_input_language.php', {
      method: 'POST',
      body: JSON.stringify(data_to_send),
      headers: new Headers({
              'Content-Type': 'application/json'})});
  var input_language_as_text = await response.text()
  var input_language = JSON.parse(input_language_as_text)
  return input_language
}


/*
At various points we need to move input language files around: we move the file from
ready_to_iterate to undergoing_iteration when a participant starts working on a
given file; we move the file back to ready_to_iterate if the particiant abandons;
we move the file from undergoing_iteration to completed_iteration if they complete.
All of these are accomplished by move_input_language - we specify the file name,
the directory to move from, and the directory to move to, and move_input_language.php
does the moving for us.

Note that this function isn't async, because we don;t actuall need to wait for the
move to complete before we can proceed.
*/
function move_input_language(input_language_filename,from_folder,to_folder){
  var data_to_send = {user:myUUN,filename: input_language_filename, source:from_folder,destination:to_folder};
  fetch('move_input_language.php', {
      method: 'POST',
      body: JSON.stringify(data_to_send),
      headers: new Headers({
              'Content-Type': 'application/json'})});
}


/*
When a participant completes the production phase, we need to save the language they
produced in the final production test so that it can be used as input for another
learner.  save_output_language works through object_label_list, which is a list of
objects of the form {object:image_filename,label:'participant_label'} that is built
during the production phase of the experiment. save_output_language builds a
CSV string which can be directly saved to server-data/il/ready_to_iterate using the
normal save_data function. Output languages are saved to a file chainX_gY.csv where
X is the chain number and Y is the generation number.

*/
function save_output_language(object_label_list) {
  var output_string = "object,label\n" //column headers plus a new line
  for (object_label_pair of object_label_list) {//for each object_label_pair
    //append object,label\n to the end of output_string
    output_string = output_string + object_label_pair.object + "," + object_label_pair.label + "\n"
  }
  //work put the filename using global variables chain and generation
  var output_file_name = 'chain' + chain + '_g' + generation + '.csv'
  save_data('ready_to_iterate',output_file_name, output_string)
}



/******************************************************************************/
/*** Observation trials ************************************************/
/******************************************************************************/

/*
This is based heavily on the equivalent code in word_learning.js

make_observation_trial is a function that takes two arguments - an object name
(a string giving the name of a jpg file in the images folder) and a label to pair
it with.

Each observation trial consists of two trials: the initial presentation of the
object (for 1000ms) and then the object plus label (in the prompt) for 2000ms.
*/

function make_observation_trial(object_filename,label) {
  trial = {type:'image-button-response',
           stimulus:object_filename,
           stimulus_height:150,
           choices:[],
           timeline:[{prompt:'&nbsp;', //dummy text
                      trial_duration:1000},
                     {prompt:label,
                       trial_duration:2000,
                       post_trial_gap: 500,
                       data:{block:'observation',
                             label:label},
                       on_finish: function(data) {
                         save_iterated_learning_data(data)
                       }
                      }]}
  return trial
}

/******************************************************************************/
/*** Production *****************************************************/
/******************************************************************************/

/*
Prioduction trials involves showing the participant an object and asking them to
generate the appropriate label. Beckner et al (2017) used free typing in production,
i.e. participants could type anything in. In some recent work with online iterated
learning we (Clem Ashton and I) switched to a more constrained production model:
participants are provided with a set of syllable options, and build complex labels
by clicking on those syllable buttons. With the correct choice of syllables this
reduces/removes the problem of participants typing English (e.g. "don't know", "no idea")
or near-English versions of random labels (e.g. "vukano" -> "volcano").
/*

/*
This requires us to lay out a set of syllables which will be available. In order not
to make production too onerous, we randomise this set of syllables once at the start
of the experiment, i.e. the syllables will appear on-screen in random order, but that
order will be consistent throughout the experiment.

The syllables here are a subset of those used in the initial language by Beckner et al.
One of the drawbacks of this production method is that the syllable inventory has to
be relatively restricted, or the array of buttons becomes a bit overwhelming.
*/

var available_syllables = jsPsych.randomization.shuffle(["ti","ta","to","tu",
                                                         "ki","ka","ko","ku",
                                                         "si","sa","so","su",
                                                         "vi","va","vo","vu"])

/*
As the participant works through the production phase we need to keep track of the
labels they produce, so that if/when they complete the production phase, we can
save their final language to use as input for another participant. We will save
their productions to participant_final_label_set.
*/
var participant_final_label_set = []

/*
make_production_trial takes an object_filename and creates a production trial for
that object; participants' choices are available_syllables plus the mandatory buttons
DELETE (to delete the last-selected syllable) and DONE (to move to the next trial).
image-button-buildlabel-response is a custom plugin, closely based on the standard
image-button-response plugin but allowing the participant to make multiple responses,
showing their building label onscreen. Note that in image-button-buildlabel-response,
participants must produce *some* label - the DONE button is unresponsive until they
have build a label containing at least one syllable.

on_finish we add {object:object_filename,label:data.label} to the participant_final_label_set
list - data.label is created by the image-button-buildlabel-response plugin and is
the final label the participant produced (i.e. their label when they clicked DONE).

We also save the trial data to the server as usual.
*/
function make_production_trial(object_filename) {
  var trial = {type:'image-button-buildlabel-response',
               stimulus:object_filename,
               stimulus_height:150,
               choices:[].concat(available_syllables,["DELETE","DONE"]), //add the DELETE and DONE buttons
               data:{block:'production'},
               on_finish: function(data) {
                 participant_final_label_set.push({object:object_filename,label:data.label})
                 save_iterated_learning_data(data)}}
  return trial
}


/******************************************************************************/
/*** Building training and testing timelines **********************************/
/******************************************************************************/

/*
If all goes well, we will read an input language from a CSV file on the server and
use it to construct an observation/training timeline, consisting of a series of
observation trials, and a testing/production timeline, consisting of a series of
production trials.

This is achieved by build_training_timeline and build_testing_timeline,
both of which take an input language specified as a list of {object:object_filename,label:a_label}
objects.
*/

/*
build_training_timeline takes a list of object_label_pairs and builds a training
timeline consisting of n_repetitions blocks - each block contains one observation
trial for each object-label pair in object_label_pairs.
*/
function build_training_timeline(object_label_pairs,n_repetitions) {
  var training_timeline = [] //build up our training timeline here
  //this for-loop works through the n_repetitions blocks
  for (i=0;i<n_repetitions;i++) {
    //randomise order of presentation in each block
    var shuffled_object_label_pairs = jsPsych.randomization.shuffle(object_label_pairs)
    //in each block, present each object-label pair once
    for (object_label_pair of shuffled_object_label_pairs) {
      var trial = make_observation_trial(object_label_pair.object,object_label_pair.label)
      training_timeline.push(trial)
    }

  }
  return training_timeline
}

/*
build_testing_timeline takes a list of object_label_pairs and builds a testing timeline
of one production trial for each object in object_label_pairs, in random order. Note
that the labels are simply discarded.
*/
function build_testing_timeline(object_label_pairs) {
  var testing_timeline = []
  var shuffled_object_label_pairs = jsPsych.randomization.shuffle(object_label_pairs)
  for (object_label_pair of shuffled_object_label_pairs) {
      var trial = make_production_trial(object_label_pair.object)
      testing_timeline.push(trial)
    }
  return testing_timeline
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

var instruction_screen_observation = {
  type: 'html-keyboard-response',
  stimulus: "<h3>Observation Instructions</h3>\
  <p style='text-align:left'>Instructions for the observation stage.</p>\
  <p>Press any key to begin</p>"
}

var instruction_screen_testing = {
  type: 'html-keyboard-response',
  stimulus: "<h3>Testing Instructions</h3>\
  <p style='text-align:left'>Instructions for the testing stage.</p>\
  <p>Press any key to begin</p>"
}

var final_screen = {
  type: 'html-keyboard-response',
  stimulus: "<h3>Finished!</h3>\
  <p>Experiments often end with a final screen, e.g. that contains a completion \
  code so the participant can claim their payment.</p>\
  <p>This is a placeholder for that information.</p>"}

var cannot_iterate_info = {
  type: 'html-keyboard-response',
  stimulus: "<h3>Oh dear!</h3>\
  <p style='text-align:left'>Participants see this screen if there are no input \
  languages available to iterate from.</p>\
  <p style='text-align:left'>You might tell them to close the browser and come back later.</p>"}


/******************************************************************************/
/*** Putting it all together **************************************************/
/******************************************************************************/

/*
Now we are in a position to put all of these functions together.

1. We see if there are any input languages available for iteration. If not, we
just tell the participant to come back later. If there is, we proceed.
2. We select a random input language to use. The name of this file tells us what
chain and generation we are running (e.g. if the filename is chain10_g7.csv we know
we are running generation 7 of chain 10), so we can extract that info.
3. We read in the input language from the appropriate file.
4. We use that input language to generate training trials for this participant. We
impose a bottleneck on transmission by taking a subset of the language of the
previous generation (here, 14 randomly-selected object-label pairs) and using that
to build the training timeline (here, repeating each of those object-label pairs once).
5. We use that input language to build a testing timeline, requiring the participant
to do a production trial for each object.
6. We build the full experiment timeline, combining the training and testing timelines
with the various information screens.
7. We move the input language file we are using from server_data/il/ready_to_iterate to
server_data/il/undergoing_iteration, so that another participant doesn't also start
working on this input language.
8. We run the timeline
9a. If the participant completes the experiment (i.e. gets to the end of the production
phase), we save the language they produced during production as a new input language
in server_data/il/ready_to_iterate and also move the input language they were trained on to
server_data/il/completed_iteration, so that we know it's been done.
9b. If the participant abandons the experiment we need to recycle their input language -
they haven't completed the experiment, so we need someone else to run this generation
of this chain. We simply move the input language file they were working on back to the
server_data/il/ready_to_iterate folder. Note that you can capture this kind of exit event
in jsPsych using the on_close parameter of jsPsych.init.

An additional thing to note: I have not implemented the deduplication filter from
the Beckner et al. method here - I figured the code was complicated enough! If you
want to implement this you will need two extra steps:
1. Before implementing step 9a, saving the participant's produced language to the
ready_to_iterate folder, you need to check it is usable, i.e. contains enough distinct
labels. If so, you proceed as normal; if not, you recycle their input language and
try again.
2. On step 4, selecting object-label pairs to use for training, you would need to
select in a way that avoids duplicate labels, rather than selecting randomly.

Also note that there is no maximum generation number in this code - chains will
run forever! If you want to stop at e.g. 10 generations, this could also be implemented
in step 9a - check this participant's generation number, if they are at generation 10
then don't save their lexicon to the ready_to_iterate folder.
*/

/*
In various places we need to know what chain and generation we are running (e.g.
for saving the participant's final language) - we store this info in these two variables,
which will be updated once we get this information.
*/
var chain
var generation

async function run_experiment() {
  //1. We see if there are any input languages available for iteration
  var available_input_languages = await list_input_languages()
  //...If not, we just tell the participant to come back later (using the cannot_iterate_info html-keyboard-response trial created above)
  if (await available_input_languages.length == 0) {
    jsPsych.init({timeline: [cannot_iterate_info]})
  }
  //...If there is, we proceed.
  else {
    //2. We select a random input language to use.
    var input_language_filename = jsPsych.randomization.shuffle(available_input_languages)[0]
    //...The name of this file tells us what chain and generation we are running
    //To retrieve generation and chain info from filename, split the filename at _ and .
    var split_filename = input_language_filename.split(/_|\./)
    //chainX will be the first item in split_filename, just need to lop off the 'chain' prefix and convert to integer
    chain = parseInt(split_filename[0].substring(5))
    //gY will be the second item in split_filename, ust need to lop off the 'g' prefix and convert to integer
    var input_generation = parseInt(split_filename[1].substring(1))
    //*This* generation will be the input language generation + 1
    generation = input_generation + 1

    // 3. We read in the input language from the appropriate file.
    var input_language = await read_input_language(input_language_filename)

    // 4. We use that input language to generate training trials for this participant.
    // We impose a bottleneck on transmission by taking a subset of the language
    // of the previous generation (here, 14 randomly-selected object-label pairs)
    // and using that to build the training timeline (here, repeating each of those
    // object-label pairs once)
    var training_object_label_pairs = jsPsych.randomization.sampleWithoutReplacement(input_language,14)
    // Note just one repetition of each label in training, just to keep the experiment duration down for you!
    var training_timeline = build_training_timeline(training_object_label_pairs,1)

    // 5. We use that input language to build a testing timeline, requiring the participant
    // to do a production trial for each object.
    var testing_timeline = build_testing_timeline(input_language)

    // NB I am creating a tidy-up trial, to run when the participant completes the production
    // phase, at this point, so it looks out of sequence! I could have done this in the
    // on_close of the last production trial, but it seemed simpler to do it as a
    // stand-alone event in the timeline, using the call-function trial type.
    // 9. If the participant completes the experiment (i.e. gets to the end of the production
    // phase), we save the language they produced during production as a new input language
    // in server_data/il/ready_to_iterate and also move the input language they were trained on to
    // server_data/il/completed_iteration, so that we know it's been done.
    var tidy_up_trial = {type:'call-function',
                         func: function() {
                            save_output_language(participant_final_label_set)
                            move_input_language(input_language_filename,'undergoing_iteration','completed_iteration')}}

    // 6. We build the full experiment timeline, combining the training and testing timelines
    // with the various information screens.
    var full_timeline = [].concat(consent_screen,
                                  instruction_screen_observation,
                                  training_timeline,
                                  instruction_screen_testing,
                                  testing_timeline,
                                  tidy_up_trial,
                                  final_screen
                                )
    // 7. We move the input language file we are using from server_data/il/ready_to_iterate to
    // server_data/il/undergoing_iteration, so that another participant doesn't
    // also start working on this input language.
    move_input_language(input_language_filename,'ready_to_iterate','undergoing_iteration')

    // 8. We run the timeline
    jsPsych.init({
        timeline: full_timeline,
        // 9b. If the participant abandons the experiment we need to recycle their input language -
        // they haven't completed the experiment, so we need someone else to run this generation
        // of this chain. We simply move the input language file they were working on back to the
        // server_data/il/ready_to_iterate folder. Note that you can capture this kind of exit event
        // in jsPsych using the on_close parameter of jsPsych.init.
        on_close: function() {move_input_language(input_language_filename,'undergoing_iteration','ready_to_iterate')},
        on_finish: function(){jsPsych.data.displayData('csv')}
    });
  }
  }

/*
Then to get everything going we just call our run_experiment() function.
*/
run_experiment()
