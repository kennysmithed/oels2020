/******************************************************************************/
/*** Preamble ************************************************/
/******************************************************************************/

/*
The experiment features two main trial types - observation (training) and production (test)
Observation: see object for 1 second, then object plus label for 2 seconds
Production: object plus two labels, select label, confirm label choice to center cursor.
*/


/******************************************************************************/
/*** Observation trials ************************************************/
/******************************************************************************/

/*
make_observation_trial is a function that takes two arguments - an object name
(a string giving the name of a jpg file in the images folder) and a label to pair
it with.

I am using the image-button-response trial type, even though the participant doesn't
provide a response at all, just because it was the easiest way to make the layout
look similar to the production trial type.

Each observation trial consists of two trials: the initial presentation of the
object (for 1000ms) and then the object plus label (in the prompt) for 2000ms. The
initial 1000ms presentation contains some dummy text as the prompt - '&nbsp;' is
a special html space character.

In the 2000ms part of the trial I add a property to the trial's data, noting that
this trial is part of the observation block of the experiment - this will come in
handy later, and will allow us to strip out the important bit of the observation
trials from all the other clutter that jspsych saves as data.
*/

function make_observation_trial(object,label) {
  var object_filename = 'images/' + object + '.jpg' //build file name for the object
  trial = {type:'image-button-response',
           stimulus:object_filename,
           choices:[],
           timeline:[{prompt:'&nbsp;', //dummy text
                      trial_duration:1000},
                     {prompt:label,
                       trial_duration:2000,
                       data:{block:'observation'}
                      }]}
  return trial
}

/*
Now we can use this function to make some observation trials - object4 paired with
two non-word labels, buv and cal.
*/
var observation_trial_1 = make_observation_trial('object4','buv')
var observation_trial_2 = make_observation_trial('object4','cal')

/*
We are going to need several of these trials in training - we can do this using
the built-in function that jspsych provides for repeating trials, jsPsych.randomization.repeat.
I will have 3 occurences of buv and 2 of cal.
*/
var observation_trials_1_repeated = jsPsych.randomization.repeat([observation_trial_1], 3)
var observation_trials_2_repeated = jsPsych.randomization.repeat([observation_trial_2], 2)

/*
We then need to stick these together into a flat trial list (using concat) and then
shuffling them so that the order of the different labelings is randomised.
*/
var observation_trials_unshuffled = [].concat(observation_trials_1_repeated,observation_trials_2_repeated)
var observation_trials = jsPsych.randomization.shuffle(observation_trials_unshuffled)


/******************************************************************************/
/*** Production trials ************************************************/
/******************************************************************************/

/*
make_production_trial is a function that takes two arguments - an object name
(a string giving the name of a jpg file in the images folder) and a list of labels
the participant must select among when labelling the object, which will appear as
clickable buttons.

Each production trial consists of three sub-trials: the initial presentation of the
object (for 1000ms), then the object plus label choices presented as buttons, then
a third trial where the participant clicks again on the label they selected on the
second trial, to centre their mouse (i.e to prevent rapid clicking through on the
left or right button.

The first subtrial (just show the object) is in principle quite simple, but in order
to make the trials flow smoothly into one another visually (i.e. avoid the object
jumping about on the screen when the buttons appear on subtrial 2) we have to include
a button array consisting of invisible, unclickable buttons. This is achieved
using the button_html propery of the image-button-response plugin (which allows us
to specify that the buttons are hidden rather than visible) *and* response_ends_trial:false,
which means that if the participant clicks on the invisible buttons nothing happens.

The second subtrial is the most important part, where we present the two label choices
and have the participant click. We want the labels to appear in a random order on
each trial (e.g. so the same label isn;t always on the left). I do this by using
the on_start property pf the trial: when the trial starts, but before anything is shown
to the participant, the labels are shuffled randomly. We also store that shuffling in
the trial's data parameter, creating a new data field called label_choices. We also
lable this trial data as being from the production block, which will be handy later.

The participant will then be shown the labels as clickable buttons with the randomised
order. When the trial ends (i.e. on_finish) we use the button_pressed property
returned by the trial to figure out which label the participant selected, and
record that in the trial data under label_selected.

The third subtrial involves a 1-button trial where the participant clicks on the
label they selected under subtrial 2. Passing information from one trial to another
is a little fiddly - in the trial's on_start parameter we use jsPsych.data.get()
to retrieve the data from the last trial (this is a complex object so we have to do
some digging to get the data we want), consult the label_selected propery of that
trial (where we stored the label the participant selected on subtrial 2) and then
present that label as the sole choice.
*/

function make_production_trial(object,label_choices) {
  var object_filename = 'images/' + object + '.jpg'
  var trial = {type:'image-button-response',
                         stimulus:object_filename,
                         timeline: [//subtrial 1: just show the object
                                    {choices:label_choices, //these buttons are invisible and unclickable!
                                      button_html:'<button style="visibility: hidden;" class="jspsych-btn">%choice%</button>',
                                      response_ends_trial:false,
                                      trial_duration:1000},
                                    //subtrial 2: show the two labelled buttons and have the participant select
                                    {choices: [],
                                      //at the start of the trial, randomise the left-right order of the labels
                                      //and note that randomisation in data
                                      on_start: function(trial) {
                                        var shuffled_label_choices = jsPsych.randomization.shuffle(label_choices)
                                        trial.choices = shuffled_label_choices
                                        trial.data = {block:'production',
                                                      label_choices:shuffled_label_choices}
                                    },

                                     //at the end, use data.button_pressed to figure out
                                     //which label they selected, and add that to data
                                     on_finish: function(data) {
                                        var button_number = data.button_pressed
                                        var label_pressed = data.label_choices[button_number]
                                        data.label_selected = label_pressed}
                                      },
                                    //subtrial 3: show the image plus selected label, make the participant click that label
                                    //(to re-center their mouse)
                                    {choices:[],
                                      on_start:function(trial) {
                                        //get the last trial response (the data generated by the button-click)
                                        var last_trial_data = jsPsych.data.get().last(1).values()[0]
                                        //look up the label_selected on that last trial
                                        var last_trial_label = last_trial_data.label_selected
                                        trial.choices=[last_trial_label] //this is your only choice
                                      },
                                  }]}
  return trial

}

/*
Use the same procedure as for observation trials to generate repeated production trials -
I am having 5 here, just testing the participant on object4 and forcing them to choose
between the two labels they saw it with in training, buv and cal.
*/
var production_trial_1 = make_production_trial('object4',['buv','cal'])
var production_trials = jsPsych.randomization.repeat([production_trial_1], 5)


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
  <p>Instructions for the observation stage.</p>\
  <p>Press any key to begin</p>"
}

var instruction_screen_production = {
  type: 'html-keyboard-response',
  stimulus: "<h3>Production Instructions</h3>\
  <p>Instructions for the production phase.</p>\
  <p>Press any key to begin</p>"
}

var final_screen = {
  type: 'html-keyboard-response',
  stimulus: "<h3>Finished!</h3>\
  <p>Experiments often end with a final screen, e.g. that contains a completion \
  code so the participant can claim their payment.</p>\
  <p>This is a placeholder for that information.</p>\
  <p>Press any key to finish the experiment and see your raw data. Your data will \
  also be saved to server_data.</p>"}


/******************************************************************************/
/*** Build the timeline *******************************************************/
/******************************************************************************/

/*
I am using concat here to make sure the timeline is a flat list - just doing
timeline=[consent_screen,instruction_screen_observation,observation_trials,...]
would produce something with a nested structure (observation_trials is itself a
list) that jspsych can't handle.
*/
var full_timeline = [].concat(consent_screen,
                              instruction_screen_observation,
                              observation_trials,
                              instruction_screen_production,
                              production_trials,
                              final_screen)


/******************************************************************************/
/*** Run the timeline *******************************************************/
/******************************************************************************/

/*
As usual, we will dump all the trials on-screen at the end so you can see what's
going on.

But we will also use some jspsych built-in functions to strip out the interesting
trials (ones we marked up as block: 'observation' or block:'production') and then
use the saveData function to save that data to the server_data folder on the
jspsychlearning server. In this case we will save it to a file called "wordlearning_data.csv".
*/
jsPsych.init({
    timeline: full_timeline,
    on_finish: function(){
      //use data.get and filter to select the trials we want
      var relevant_data = jsPsych.data.get().filter([{block: 'observation'}, {block:'production'}])
      var relevant_data_as_csv = relevant_data.csv() //convert that to a csv file
      saveData("wordlearning_data.csv", relevant_data_as_csv) //save it
      jsPsych.data.displayData('csv') //and also dump *all* the data to screen
    }
});

/*
This is the saveData function provided in the tutorial.
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
