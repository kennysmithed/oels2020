---
title: Week 8 practical
description: Audio recording, more randomisation stuff, custom preload lists, reading trial lists from CSV
---

## The plan for week 8 practical

This week we are going to look at code for a confederate priming experiment based on the experiment described in Loy & Smith (2020) (and in fact using some of our stimuli). There's no new material to look at in the Online Experiments with jsPsych tutorial. As in the perceptual learning experiment we use the `audio-button-response` plugin to play audio and get button-click responses from a participant when they are listening to the confederate. We need some new background infrastructure to get the participant to record their own spoken descriptions: we use `image-button-response` trials to have the participant look at an image, click a mic button to start recording audio, and then we call some behind-the-scenes functions that will record audio and save it to the server - you don't actually need to know how the audio recording code works, although it's all commented up. We are also going to add a few more bits and pieces involving randomisation (random participant IDs, random wait durations to simulate a human partner, random flipping of some image orientations), we'll build a custom preload list to make sure our button images are preloaded before the experiment starts, and finally I'll show how to load a trial list from a CSV file (handy if you don't want to have to specify how to build the trial list inside the jsPych code).

Remember, as usual the idea is that you do as much of this as you can on your own (might be none of it, might be all of it) and then come to the practical drop-in sessions or use the chat on Teams to get help with stuff you need help with.

## Acknowledgments

I cobbled together some audio recording code for the online experiments in Loy & Smith (2020); Annie Holz then jsPsych-ified it ([she has her own audio recording demo](https://experiments.ppls.ed.ac.uk/)), and I tweaked that code for this demo experiment.

For this demo experiment we are using audio stims produced by my RA Clem Ashton, who was the native English-speaking confederate in some experiments we ran (not actually those reported in the current draft of Loy & Smith, 2020, but some follow-ups). The images (which I love) were drawn by Jia Loy and are the ones we used in the experiments described in the paper.

## A confederate priming experiment

### Getting started

As usual, I'd like you to download and run the code I provide, look at how the code works, and then attempt the exercises below, which involve editing the code in simple ways.

You need a bunch of files for this experiment - as per last week, an html file, a js file, *two* php files (for saving CSV and audio data), and then various folders containing images, sounds, trial lists etc. Again, rather than downloading them individually, download the following zip file and then uncompress it into your usual jspsych folder:
- <a href="code/confederate_priming.zip" download> Download confederate_priming.zip</a>

Again, the code makes some assumptions about the directory structure it's going to live in - you need to extract these files to a folder called something like `confederate_priming`, alongside your `grammaticality_judgments`, `self_paced_reading`, `word_learning`, `perceptual_learning` and `jspsych-6.1.0` folders.

Like last week, this code will *not* run on your local computer - you need to upload the whole `confederate_priming` folder to your public_html folder on the jspsychlearning server and play with it there. Furthermore, there are a couple of things to tweak before you can run the code:
- You need to edit `save_data.php` and `save_audio.php` so that they point to *your* `server_data` folder rather than mine. Open those files in an editor and change the path `/home/ksmith7/server_data/` to `/home/UUN/server_data/` where UUN is your UUN.
- The code will save audio files to a subfolder of `server_data` called `audio` - so you need to create such a subfolder. You can create new folders in cyberduck quite easily.
- You will need to use Chrome for the audio to work reliably. Furthermore, you will have to change your Chrome settings to allow it to access the microphone. Quite sensibly, modern browsers have protections that prevent random websites accessing your microphone or camera in unsafe ways; the user always has to give permission, but also those resources are only available when the origin of the code (i.e. our server where the code lives) is secure, i.e. can be trusted to be who it says it is. Our `jspsychlearning` server is not set up like that at the moment, it lacks the necessary certificates, so we have to tell Chrome to trust it for audio recording purposes - obviously you wouldn't ask real participants to do this step, you'd have to set up a secure server for your code, but in our case it's only us trying out the code and we know it's nothing dodgy, so we can use this work-around. The way to do this is as follow the following 4 steps (which I got from [here](https://medium.com/@Carmichaelize/enabling-the-microphone-camera-in-chrome-for-local-unsecure-origins-9c90c3149339)).
  - In chrome, copy this address into the navigation bar: chrome://flags/#unsafely-treat-insecure-origin-as-secure and go there.
  - Find and enable the `Insecure origins treated as secure` section.
  - Add http://jspsychlearning.ppls.ed.ac.uk to the text box of origins you want to treat as secure.
  - Save those settings if that is an option, then close that window and restart Chrome.

Once you have done those various steps you are ready to try out the experiment. There are actually two versions of the experiment included in the zip file:
- A short version with a small number of trials. The code for this is in `confederate_priming.html` and `confederate_priming.js`, and the URL will be http://jspsychlearning.ppls.ed.ac.uk/~UUN/confederate_priming/confederate_priming.html if your directory structure is as suggested. This is the code I will start with in the explanation below.
- A full-length version with a large number of trials (100+). The code for this is in `confederate_priming_readfromcsv.html` and `confederate_priming_readfromcsv.js`, and the URL should be http://jspsychlearning.ppls.ed.ac.uk/~UUN/confederate_priming/confederate_priming_readfromcsv.html. If you want a longer demo you can run this, but the main purpose of including the second version is to show you how a long trial list can be read in from a CSV file.

First, get the code and run through it so you can see what it does. If you have problems with getting the audio to record to the server, get in touch with me! Then take a look at the HTML and js files in your code editor (e.g. Atom), and read on.

### Structure of the experiment

The experiment consists of two trial types, which alternate:
- Picture selection trials, where participants hear audio from their partner (in fact, pre-recorded audio from our confederate) and select the matching picture from an array of 4 pictures.
- Picture description trials, where participants see a picture and produce a description for their partner using a provided verb, clicking a mic icon to start and stop recording.

We are interested in whether, on critical trials featuring a ditransitive event,
the construction used in the description on the picture selection trial (PO or DO) influences the description the participant produces on the immediately following picture description trial.

Picture selection trials work in essentially the same was as picture selection trials in the perceptual learning experiment, using the `audio-button-response` plugin. Picture description trials are a series of `image-button-response` trials (with the participant clicking on a mic button to start and stop recording), with some additional infrastructure to handle recording audio. We also simulate the confederate preparing to speak and making a selection based on the participant's productions by inserting variable "waiting for partner" screens. The code therefore uses plugins you are already familiar with - the main new addition to the code is some functions which record audio, but you don't actually need to know how this works (although the code is there for you to look if you are interested).

### Loading the code for recording audio

Rather than putting all the audio recording code plus all the other experiment code in one long js file, I have split it - the audio recording code is in `confederate_priming_utilities.js`, which we load in our `confederate_priming.html` file at the same time as specifying the plugins etc we need and loading the `confederate_priming.js` file.

```html
<script src="../jspsych-6.1.0/jspsych.js"></script>
<script src="../jspsych-6.1.0/plugins/jspsych-html-button-response.js"></script>
<script src="../jspsych-6.1.0/plugins/jspsych-html-keyboard-response.js"></script>
<script src="../jspsych-6.1.0/plugins/jspsych-image-button-response.js"></script>
<script src="../jspsych-6.1.0/plugins/jspsych-audio-button-response.js"></script>
<link href="../jspsych-6.1.0/css/jspsych.css" rel="stylesheet" type="text/css"></link>
<script src="confederate_priming_utilities.js"></script>
<script src="confederate_priming.js"></script>
```

The browser doesn't actually care if code is split over more than one file - it reads them in one after another, so variables and functions created in one file are accessible in code in another file. Splitting the code in this way makes for code that's easier to work with and also conceptually cleaner, in that you parcel off one set of functions (in this case, for recording audio) into its own file.

For our purposes all you have to know is that `confederate_priming_utilities.js` creates some variables and functions that we can use in our main experiment code. These are:

`recording_counter`  is just a counter where we keep track of how many audio recordings we have made - the first recording is 0, the second 1 etc. We use these in the filenames of recordings and also in the CSV data saved on the server so that we can link particular recordings to particular experiment trials.

`request_mic_access()` is a function which creates the various media and recorder objects we need to record audio, and will prompt the participant for mic access via a pop-up.

`start_recording(filename_prefix)` is a function starts audio recording from the participants' mic. When the audio recording stops, the audio will be saved
to a file on the server (in `server_data/audio`) called filename_prefix_recording_counter.webm - e.g. if you pass in filename prefix "kennyaudio" the first recording will be saved as kennyaudio_0.

`stop_recording()` is a function which stops the current audio recording, triggering saving of the audio file, and also increments the `recording_counter` so that the next recording has a different counter value and different file name.

### Random elements of the experiment

The first part of `confederate_priming.js` is comments on the audio recording code (for human reading, the code ignores these) and then some code for saving our data trial by trial - the function `save_confederate_priming_data(data)` saves trial data in the same way as the `save_perceptual_learning_data` function from last week, and you'll see it used in the functions below. Since you have seen similar functions before, I'll skip to the new code, which starts with several functions for handling random elements of the experiment.

First, we are going to assign each participant a random participant ID - this means we can save one CSV file and one set of audio recordings per participant, rather than cramming everything into a single file as we have been doing so far. We create these random IDs using a jsPsych built-in function:

```js
var participant_id = jsPsych.randomization.randomID(10);
```

This creates a variable, `participant_id`, which we can use later. The participant IDs are a list of 10 randomly-generated letters and numbers - since there are many many possible combinations of length 10 (36 to the power 10, which is more than 3,600,000,000,000,000) in practice this should mean that no two participants are assigned the same ID, and therefore each participant has a unique ID.

At various points in the experiment we also want to create a random wait, to simulate another participant composing their description or selecting an image based on the genuine participant's description. In the Loy & Smith (2020) paper we had a fairly intricate system for generating these random delays, making them quite long initially (to simulate a partner who was not yet used to the task) and then reducing over time (to simulate increasing familiarity, but also not too needlessly waste our real participants' time). My impression is that this was reasonably successful - not too many participants guessed they were interacting with a simulated partner - and also worth the effort, in that most of the people who *did* guess that they were not interacting with a real person were cued by their partner's response delays (in particular, noting that they were quite short and quite reliable). Here for simplicity's sake we just create a function which returns a random delay between 1000ms and 3000ms, using some built-in javascript code for random number generation:

```js
function random_wait() {
  return 1000+(Math.floor(Math.random() * 2000))
}
```

`Math.random()` generates a random number between 0 and 1 (e.g 0.127521, 0.965341, etc). We then multiply that by 2000 and use `Math.floor` to round down to a whole number (e.g. our random numbers will become 255, 1930 respectively), then add 1000ms to produce random waits in our desired range (e.g. 1255ms, 2930ms).

Finally, we need some code to randomly decide whether to include images in their default or reversed orientation. Participants will be describing events involving characters and objects, and we have good reasons to expect that the order in which characters appear in those scenes might influence the word order participants use (e.g. if people tend to process images left to right, and the recipient of a giving action is always in the left, maybe people will be likely to mention that recipient earlier in their description, introducing a bias for DO order). We therefore want to eliminate those kinds of systematic biases by presenting images in both possible orientations (e.g. recipient on the left or the right). The `images` folder contains two versions of each image - the orientation that Jia drew them in, and then a reversed image where the image is flipped/mirrored on its horizontal axis. The two images have the same name except that the reversed image has "_r" added at the end - so for example, the two images below are `artist_brushes_book.jpg` and `artist_brushes_book_r.jpg`.

![artist_brushes_book](images/artist_brushes_book.jpg)
![artist_brushes_book_r](images/artist_brushes_book_r.jpg)

Our `random_image_flip` function will handle this for us - every time we want to include an image, we use `random_image_flip(image_name)`, which takes an image name and either returns that image name or the reversed version, by adding "" (i.e. nothing) or "_r" to the end of the image name. The random element is achieved by picking either "" or "_r" at random using `jsPsych.randomization.shuffle`.

```js
function random_image_flip(image_name) {
  var image_affixes = ["","_r"]
  var selected_affix = jsPsych.randomization.shuffle(image_affixes)[0]
  var new_image_name = image_name + selected_affix
  return new_image_name
}
```

### Picture selection trials

Now we are in a position to start coding up our main trial types. We'll start with picture selection trials, which work in a very similar way to picture selection trials in the perceptual learning experiment - participants hear some audio and then click on an image button. The only added complication here is that we want to simulate another person thinking for a moment before starting their description, which we will achieve by adding a "waiting for partner" message, on-screen for a random duration, followed by our picture selection trial. Each picture selection trial therefore consists of two sub-trials: a random wait, then the picture selection. As usual, we'll write a function where we specify the main parts of the trial (the audio file the participant will hear, the images they will choose among) and then the function returns a complex trial object for us. Here's the code:  

```js
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

```

Several things to note here. First, we need to do some book-keeping: adding the path for the sound file (all our sound files are in the `sounds` directory and have `.mp3` on the end)

```js
var sound_file = "sounds/" + sound + ".mp3"
```
and randomising the orientation in which the images will be presented by working through the `images` list with a for-loop, randomly flipping each image or not and building up our array of `image_choices`:

```js
var image_choices = []
for (image of images) {
  image_choices.push(random_image_flip(image))
}
```

Our random wait is then a simple `html-keyboard-response` trial, where there are no button responses accepted (`choices` is set to [], i.e. nothing the participant can press will make the trial end prematurely) and with a random `trial_duration`.

```js
var waiting_for_partner = {type:'html-keyboard-response',
                           stimulus:"Waiting for partner to speak",
                           choices:[],
                           trial_duration:function() {return random_wait()}}
```

Our actual selection trial requires quite a large block of code to generate it (see above, where we create `selection_trial`), but this is all stuff you have seen before - an `audio-button-response trial`, where we randomise the button position `on_start`, and then work out which button the participant actually clicked `on_finish`, saving the trial data to the server using the `save_confederate_priming_data` function too. The one thing we have added is an extra parameter to the trial `data` object, simply marking these trials as picture selection trials:

```js
data.trial_type = 'picture_selection'
```
This will just make our data file a little clearer.

Finally, we stick our waiting trial and our picture selection trial together as a single trial consisting of just a timeline and returning that two-part trial.:

```js
var full_trial = {timeline:[waiting_for_partner,selection_trial]}
return full_trial
```

### Picture description trials

Next we create our picture description trials - remember, for these the participant sees an image, clicks a button to start recording a description, clicks again to stop recording, and then waits for their partner to make a picture selection based on their description (in reality, just gets a waiting message and waits for a random time). This can be achieved with a 3-part timeline: the initial part of the trial where the participant sees the image and clicks a button to start recording, then the second part where they speak and then click again to stop recording, then the random wait. The first two trial types are just `image-button-response` trials, and the random wait will again be an `html-keyboard-response` trial with a random duration. Again, we are going to write a function which builds this complex trial for us - we pass in the target image to be described plus the verb to be used in the description. The full code is:

```js
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
                                   stop_recording()
                                   data.recording_counter = recording_counter
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
```

Let's step through that chunk by chunk. First we randomly flip the image so that not all images appear in the default orientation:

```js
var target_image_flipped = random_image_flip(target_image)
```

Next we have the first sub-trial where the participant sees the image plus a "start recording" button and clicks to begin recording. This is just an `image-button-response` trial, with our target image and a button showing a picture of a mic:

```js
var picture_plus_white_mic = {type:'image-button-response',
                              stimulus:"images/"+target_image_flipped+".jpg",
                              stimulus_width: 500,
                              prompt:verb,
                              choices:['mic'],
                              button_html:'<button class="jspsych-btn" style="background-color: white;"> <img src="mic_images/%choice%.png" width=75px></button>'}
```

We set the size of the picture (I though 500 pixels wide was reasonable), and show the verb the participant should use in the `prompt` (it's not super-prominent, but it will do - you would want to write instructions which highlighted this verb text to the participants so they know what the prompt is doing). The participant's `choices` on this trial is just the mic button - we use the `mic` image file, which is in the `mic_images` folder, and do a little bit of formatting in `button_html` so the mic image appears with a white background (which we'll change below to orange to indicate they are recording).

When the participant is ready they click the mic button, which progresses them to the next trial. This is where the action happens: we have to indicate they are recording (which we do by turning the mic button orange), actually start the recording, and then when the click the mic again we have to stop the recording and save the trial data. The code for all that looks like this:

```js
var picture_plus_orange_mic = {type:'image-button-response',
                               stimulus:"images/"+target_image_flipped+".jpg",
                               stimulus_width: 500,
                               choices:['mic'],
                               prompt:verb,
                               button_html:'<button class="jspsych-btn" style="background-color: Darkorange;"> <img src="mic_images/%choice%.png" width=75px></button>',
                               on_start: function(trial) {
                                 start_recording(participant_id)},
                               on_finish: function(data) {
                                 stop_recording()
                                 data.recording_counter = recording_counter
                                 data.trial_type = 'picture_description'
                                 save_confederate_priming_data(data)}
                               }
```

A bunch of stuff is the same as in the `picture_plus_white_mic` trial - the image, its size, the mic button, the verb prompt - so there is no big visual change. But a couple of things are different.

First, we change the background colour of the mic image to orange, so the participant can see their click had an effect and they are now recording. This is done in the `button_html` parameter, where we set the mic button background to dark orange.

```
button_html:'<button class="jspsych-btn" style="background-color: Darkorange;"> <img src="mic_images/%choice%.png" width=75px></button>',
```

Next, the trial has an `on_start` function, where we use the `start_recording` function to start recording from the participant's mic. Remember, this function is defined in our `confederate_priming_utilities.js` file, and we specify the name of the file where we want the audio saved - here we are using the participant's ID (which we created earlier and stored in the variable `participant_id`), so that each participant's audio will be recorded in easily-identified and separate sets of files:

```js
on_start: function(trial) {
  start_recording(participant_id)},
```

Finally, when the participant is done talking they click the mic button again to stop recording - so in this trial's `on_finish` parameter (which runs when they click the mic button again) we stop the recording using our `stop_recording()` function, which again is defined in our `confederate_priming_utilities.js` file.

```js
on_finish: function(data) {
  stop_recording()
  ...
}
```
 We also want to save the data from this trial, which we do using `save_confederate_priming_data` - but when we do that, we want to keep a note of `recording_counter` (which is our internal counter of recording numbers), so that when it comes time to listen to the recordings we can link the audio recording files (which include `recording_counter` in their name) with the specific trial in the experiment. To do that, we make a note of `recording_counter` in our trial data, and also mark this trial as a picture description trial, then save that data.

 ```js
 on_finish: function(data) {
   ...
 data.recording_counter = recording_counter
 data.trial_type = 'picture_description'
 save_confederate_priming_data(data)}
 ```

Finally, we add the waiting message with random duration, in exactly the same way as for picture selection trials, and then build and return a trial with a nested timeline featuring our three trials (white mic, orange mic, waiting message):

```js
var waiting_for_partner = {type:'html-keyboard-response',
                           stimulus:"Waiting for partner to select",
                           choices:[],
                           trial_duration: function() {return random_wait()},
                           post_trial_gap: 500} //short pause after the confederate makes their selection
var full_trial = {timeline:[picture_plus_white_mic,
                            picture_plus_orange_mic,
                            waiting_for_partner]}
return full_trial
```

### Building the interaction timeline

Now we can use these functions to build our timeline. We'll start by building a set of interaction trials, which alternate picture selection and picture description trials, then add the usual instructions etc later. Here's a set of 8 trials - the critical trials are 3 and 4 (the confederate produces a PO description then the participant describes a ditransitive event) and 7 and 8 (the confederate produces a DO description then the participant describes a ditransitive event). Note that the audio files have quite complex names, these were based on a numbering system we used to keep different experiment versions and run numbers distinct.


```js
var interaction_trials = [make_picture_selection_trial("E1N_16_the_clown_buys_the_cake",
                                                       ["clown_buys_cake","artist_buys_cake","clown_buys_vase","artist_buys_vase"]),
                          make_picture_description_trial("artist_waves","waves"),
                          make_picture_selection_trial("E1N_16_the_cowboy_hands_the_cup_to_the_golfer",
                                                       ["cowboy_hands_golfer_cup","golfer_hands_cowboy_cake","golfer_hands_cowboy_cup","cowboy_hands_golfer_cake"]),
                          make_picture_description_trial("sailor_gives_wizard_apple","gives"),
                          make_picture_selection_trial("E1N_16_the_wizard_loans_the_prisoner_the_apple",
                                                       ["wizard_loans_prisoner_apple","prisoner_loans_wizard_vase","prisoner_loans_wizard_apple","wizard_loans_prisoner_vase"]),
                          make_picture_description_trial("pirate_holds_cake","holds"),
                          make_picture_selection_trial("E1N_16_the_sailor_offers_the_prisoner_the_cup",
                                                       ["sailor_offers_prisoner_cup","prisoner_offers_clown_cup","clown_offers_prisoner_cup","prisoner_offers_sailor_cup"]),
                          make_picture_description_trial("soldier_offers_clown_apple","offers")]
```

We then combine `interaction_trials` with some information screens (including a detailed explanation for the participant on granting mic access) to produce the full experiment timeline.

### A custom preload list

As I mentioned in last week's practical, jsPsych pre-loads images and audio for certain trial types, which makes the experiment run more smoothly and ensuring e.g. that images you think participants are seeing have actually been loaded and are displaying. In particular, the image in `image-button-response` trials and the audio in `audio-button-response` trials are preloaded automatically, However, jsPsych does not automatically preload the images used as buttons in `audio-button-response` trials, which means our image buttons in picture selection trials will not be pre-loaded. Fortunately jsPsych allows you to specify an additional list of images to be preloaded, which we will take advantage of to preload these button images.

While we could manually code up a preload list, the most straightforward way to do this is to work through `interaction_trials` and figure out which images are going to be used in the experiment, then add those images to a `button_images_list` which we later preload. The information we want is actually quite deeply embedded in `interaction_trials` though:
- each item in `interaction_trials` is a trial with a nested timeline
- of the sub-trials in those nested timelines, we only care about `audio-button-response` trials
- for each of those trials, the information we need is in the `choices` parameter
- but `choices` is itself a list of several images, all of which we need to preload.

We can deal with this with a nested for-loop. First we work through the full trial list, looking at each trial in turn:
```js
for (trial of interaction_trials) {
  ...
}
```

For each of those trials, we look at its timeline:
```js
for (trial of interaction_trials) {
  var trial_embedded_timeline = trial.timeline
  ...
}
```

For each of the trials in that timeline, we check if it's an `audio-button-response` trial:
```js
var button_images_list = []
for (trial of interaction_trials) {
  var trial_embedded_timeline = trial.timeline
  for (subtrial of trial_embedded_timeline) {
    if (subtrial.type=='audio-button-response') {
      ...
    }
  }
}
```

If it is, we retrieve the trial `choices`:
```js
var button_images_list = []
for (trial of interaction_trials) {
  var trial_embedded_timeline = trial.timeline
  for (subtrial of trial_embedded_timeline) {
    if (subtrial.type=='audio-button-response') {
      var image_choices = subtrial.choices
      ...
    }
  }
}
```

We work through those choices with yet another for loop:
```js
var button_images_list = []
for (trial of interaction_trials) {
  var trial_embedded_timeline = trial.timeline
  for (subtrial of trial_embedded_timeline) {
    if (subtrial.type=='audio-button-response') {
      var image_choices = subtrial.choices
      for (image of image_choices) {
        ...
      }
    }
  }
}
```

And finally we add each of those choices to our building preload kist using `push`, remembering to add info on the image path and file type. The final code to build the preload list looks like this:

```js
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
```

### Running the timeline

Now we have our preload list we can tell jsPsych to load those images before it starts the timeline, using the `preload_images` parameter of `jsPsych.init`.

```js
jsPsych.init({
    preload_images: button_images_list,
    timeline: full_timeline,
    on_finish: function(){
      jsPsych.data.displayData('csv') //and also dump *all* the data to screen
    }
});
```

### Advanced: reading the trial list from a CSV file

That's probably enough for one week, so if you feel you have learned enough for today you can skim this section very fast and not worry about the details, or skip it entirely and the avoid the questions at the end using the version of the code that reads from a CSV file. But if you can take a bit more, read on! You don't have to master the details of this stuff, but getting the rough idea of how you read trial data from a CSV might be useful at some point.

The code above, which is in `confederate_priming.html` and `confederate_priming.js`, is perfectly adequate, and by adding more trials to `interaction_trials` you could fully replicate the Loy & Smith (2020) online experiments. However, we actually built those experiments slightly differently. You might recall from the paper that we ran 3 lab experiments, then online experiments as a follow-up, where we used the recordings of the confederate from the lab experiments as the confederate audio in the online version. That meant we couldn't generate timelines from scratch for the online experiment, because we could only have trials where we had the appropriate audio recordings available. We decided the simplest way to do this was to use our data CSV files generated in the lab experiment as the basis for the trial lists in the online experiment - we took those data files, stripped out a bunch of information, and then built new trial lists from those CSV files. This ensured that our online experiments closely matched our lab experiments in terms of images described etc, which meant that we had all the audio we needed.

If you look in the `trial_lists` folder you downloaded as part of the zip file for this week, you'll see a couple of CSV files containing trial lists - one for an alternating confederate, and one for a confederate who only produces DO descriptions. We have many such files, but to keep it simple I'll only show you two! Each line of those CSV files describes a pair of trials: the name of the file where we saved the audio of a confederate description (in the "confederateSentence" column), the 4 images the participant chose between (in the "matcherArray" columns), then the image the participant was instructed to describe (in the "participantImage" columns) and the verb they were to use (in the "participantVerb" column), plus a bunch of other information that we saved. We can therefore read in these CSV files and use them to build a jsPsych trial list which closely matches the experience of our lab participants and uses the confederate audio recordings we have available.

That's what `confederate_priming_readfromcsv.html` and `confederate_priming_readfromcsv.js` do. Most of the code is the same as the basic `confederate_priming.js` code, but at the end you'll see some extra code for reading a CSV file into javascript and then converting it to a jsPsych trial list. The main function is `read_trials_and_prepare_timeline` - we specify  the file name for a trial list and it reads it, creates a timeline and then runs it. Then we can start the experiment by running something like:

```js
read_trials_and_prepare_timeline("trial_lists/alternating_ns_confederate.csv")
```

E.g. in this case, loading the alternating confederate trial list. But how does this code work?

Reading a trial list from a CSV file in this way is slightly complicated, for two reasons. One reason is that we have to convert the text in the CSV file into something we can work with in javascript, which takes some time (the code contains two functions which do this, `process_data` and `build_timeline`). But the other reason is that javascript behaves quite differently to other programming languages you may have used, in that it tries to run the code `synchronously` where it can - in other words, it doesn't necessarily wait for one function to finish before it starts the next function running. This isn't really noticeable unless you try running one function that is quite slow to execute *and* you need to use the output from that function as the input to another function, which is exactly what happens when we read a CSV file from the server. You might think we could do something like:

```js
var csv_as_text = fetch(triallist_filename)
var trial_list = process_data(csv_as_text)
```
where `fetch` gets the data from the CSV and then `process_data` turns it into a trial list that we can work with. However, this won't work - in practice, your browser doesn't wait for the `fetch` command to finish before it starts the `process_data` code running, but that means that `process_data` will fail because the `csv_as_text` object doesn't actually contain any data yet, because fetching data from a CSV file on the server takes some time (only a few hundred milliseconds, so it appears instantaneous to us, but for the computer is very slow and more than enough to move on and try to run the next part of the code).

How can we get around this problem? There are various solutions, but I think the simplest one is to use the `async` and `await` functions in newer versions of javascript. This allows us to declare some functions as `async` (i.e. asynchronous), and then use `await` to tell the browser to *await* a certain function to complete before moving on. This means we can wait until the CSV file has been successfully read before we try to process the resulting data.  

That's how the `read_trials_and_prepare_timeline` function does - the full code is below, but this consists of the following steps:
- fetch data from the CSV file - we will `await` this result because we can't proceed without it.
- retrieve the text part of that response (which is the actual CSV contents) - again, we need to `await` this outcome.
- convert the resulting CSV text into a javascript object we can work with using the `process_data` function.
- use that to build the interaction trials using the `build_timeline` function, which basically reads the relevant columns from the CSV and uses the `make_picture_selection_trial` and `make_picture_description_trial` functions we created earlier to make jsPsych trials.
- build our image button preload list, which is just the same process as before but wrapped up in a function called `build_button_image_preload_list`.
- stick that interaction timeline together with the instruction trials to produce our full timeline.
- and then run it, preloading images in the same way as before.

In code, these steps look like this:

```js
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
```

This involves some slightly more complicated javascript than we have seen before, in particular the `await` stuff, but being able to specify your trial list ahead of time and save it as a CSV file is quite useful in general and something we will specifically need in the last practical of the course.

## Exercises with the confederate priming experiment code

Attempt these problems.
- Run the basic `conferedate_priming.html` experiment and look at the CSV and audio data files it creates. Check you can access the audio, and that you can see how the audio and the trial list link up.
- Run it again and see what happens to the data from the second run - you may need to refresh your cyberduck window with the refresh button.
- The short trial list I built in `conferedate_priming.js` is for a confederate who uses both PO and DO descriptions. How would you change that trial list to model a DO-only confederate?
- Now try running the `conferedate_priming_readfromcsv.html` experiment and run through some more trials (you don't have to do the whole experiment!). Again, check you can see your data on the server.
- For this version of the experiment, how do you switch from an alternating to DO-only confederate? (Hint: this involves changing the name of the file used by the `read_trials_and_prepare_timeline` function in the very last line of the code).
- For either of these experiments, figure out how to disable image preloading for the button images and re-run the experiment. Can you see the difference? If it works smoothly, try running the experiment in Chrome in Incognito mode, which prevents your browser saving images etc for you. Can you see the difference now?
- [Harder, optional] Can you change the `random_wait` function so it generates longer waits early in the experiment and shorter waits later on?


## References

[Joy, J. E., & Smith, K. (2020). Syntactic adaptation depends on perceived linguistic knowledge: Native English speakers differentially adapt to native and non-native confederates in dialogue. https://doi.org/10.31234/osf.io/pu2qa.](https://doi.org/10.31234/osf.io/pu2qa)

## Re-use

All aspects of this work are licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).
