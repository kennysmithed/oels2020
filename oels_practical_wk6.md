---
title: Week 6 practical
description: Using trial data for contingent trials, filtering and saving data to the server
---

## The plan for week 6 practical

This week we are going to look at a bit more of the [Online Experiments with jsPsych tutorial](https://softdev.ppls.ed.ac.uk/online_experiments/index.html), and then look at code for a simple word learning / frequency learning experiment based on the Ferdinand et al. (2019) paper we read this week. This builds on the self-paced reading experiment in that it uses nested timelines and functions to construct trials which have a fairly complex structure. It also requires randomisation and contingent trials (what the participant sees on one trial depends on what they did at the previous trial), so we need to introduce some infrastructure to do that. Finally, I'll add some code to filter experiment data (dropping all the clutter that jspsych records) and record the important data on the server at the end of the experiment, rather than just dumping it to the screen.

Remember, as usual the idea is that you do as much of this as you can on your own (might be none of it, might be all of it) and then come to the practical drop-in sessions or use the chat on Teams to get help with stuff you need help with.

## Tutorial content

Read through [section 06 of the Online Experiments with jsPsych tutorial](https://softdev.ppls.ed.ac.uk/online_experiments/data.html). It's up to you whether you want to do the exercises dotted through the tutorial or not - they are not strictly necessary I think, since we will see the same bits of code in the word learning experiment, but you can if you want. The key things you need to take away from the tutorial are:
- You can save data to the server either at the end of the experiment, which is what I have implemented in the word learning code, or after every trial (which we will get to in a later week). Saving data trial-by-trial is better (e.g. if a participant contacts you to tell you they got part-way through the experiment then their computer died you can actually verify this, pay them accordingly and also have some of their data), but is slightly more complex and I am trying to introduce the complexity incrementally. You don't have to understand the details of how the POST and PHP stuff works to save the data, just that it's possible and it works.
- The `data` property of jsPsych trials. Each trial has a `data` parameter which is populated by the code automatically depending on what the participant does during the trial - e.g. on an `html-button-response` trial it records the index of the button the participant pressed (0 for the first choice, 1 for the second choice) in the `data.button_pressed`. But we can also add to the `data` parameter ourselves - we can add information on the participant to every trial (e.g. their ID number), or we can add specific bits of data to certain trials (in the tutorial Alisdair gives the example of marking up trial type to allow you to separate 'boring' trials from important ones). In the word learning experiment we'll use the same technique for data filtering, but also to record important information like the label the participant clicked on (rather than just the index), which we can then use to handle cases where the response at one trial affects what happens at the next trial.

## A word learning experiment

### Getting started

As per last week, I'd like you to download and run the code I provide, look at how the code works, and then attempt the exercises below, which involve editing the code in simple ways and puzzling over the output.

You need a bunch of files for this experiment - as usual an html file and a js file, but also a php file (for saving data) and a folder containing a bunch of images. Rather than downloading these seperately, download the following zip file and then uncompress it into your usual jspsych folder:
- <a href="code/word_learning.zip" download> Download word_learning.zip</a>

Again, the code makes some assumptions about the directory structure it's going to live in - regardless of whether you are putting this on your own computer or on the jspsychlearning server, these should sit in a folder called something like `word_learning`, alongside your `grammaticality_judgments`, `self_paced_reading` and `jspsych-6.1.0` folders.

![suggested directory structure](images/wl_directory_structure.png)

Assuming you have the directory structure all right, this code should run on your local computer (just open the `word_learning.html` file in your browser) or you can upload the whole `word_learning` folder to the public_html folder on the jspsychlearning server and play with it there. Note that the code that saves the data to the server will only work if your code is actually running on the jspsychlearning server - if you are running it on your own computer the data will not save anywhere, although it will still be shown on-screen. This is because your personal computer isn't running anything that can handle POST commands and processing them with PHP, which is what is involved in saving data - those things are all set up on the jspsychlearning server for you.

First, get the code and run through it so you can check it runs, and you can see what it does. Then take a look at the HTML and js files in your code editor (e.g. Atom).

### Nested timelines again

Like in the self-paced reading experiment, individual trials in this word-learning experiment are somewhat complex - they involve a sequence of steps. There are also two trial types in the experiment - observation trials, which are presentations on an object plus a label (I think of these as training trials, so if I say "training" somewhere I mean "observation", but I am trying to be consistent with the terminology we used in the paper), and production trials, where the participant is prompted to select a label for an object (I think of these as test trials).

Each observation trial consists of 2 steps: display the object for 1 second, then display the object plus a label for 2 seconds.

Each production trial consists of three steps: display the object, then display the object plus two labels and have the participant select a label, then have the participant confirm their label choice with a further click (which serves to centre their cursor, to prevent them mashing through the experiment too fast by clicking continually on one side).


This should all sound familiar from the self-paced reading experiment, and we are going to handle it in the same way, by using nested timelines - the only difference is that each trial in the nested timeline in the self-paced reading experiment was essentially the same (see a word, press space) whereas here the component trials differ a little more.

### Trial data

You should by now be familiar with the idea that each jsPsych trial has some properties that we can set - the trial `type` (html with keyboard response, image with button response etc), the valid `choices`, the `trial_duration` etc. In the same way, each trial has a `data` property. By default the `data` property is populated automatically by the plugin, and records data relevant to that trial type - for each plugin you'll notice there's a section of the documentation telling you what it records, for instance I can see from [the image-button-response documentation](https://www.jspsych.org/plugins/jspsych-image-button-response/) (which is the plugin that we'll be using in this experiment) that it records reaction time and the index of the button that the participant pressed. But we are also allowed to add stuff to the `data` property, to augment this automatically-generated content.

In this experiment we are going to use this `data` property in two ways. First, we are going to flag trials which actually contain important data. You will have already noticed that jsPsych gathers data on *all* trial types, including things like reaction times and stimulus on the consent screen. Recording everything is a good way to avoid losing anything, but it does make for quite a cluttered data structure at the end of the experiment. For certain critical trials in this experiment, we are going to add some information to the trial data, a `block` property, indicating trials that belong to the experiment phases/blocks that we really care about (what the participant saw on an observation trial, what they selected on a production trial); marking up those trials in that way will make it easy to find the important data at the end of the experiment.

Second, the `data` from one trial sticks around as the experiment runs. We can therefore look at the `data` property of earlier trials when constructing a new trial, which allows us to build sequences of trials where what the participant does at one trial (which button they clicked) affects what they see at the next trial (we look at the `data` from the earlier trial, extract the info we want, then use that to build the new trial).

### Observation trials

OK, let's get started with the code. Remember that each observation trial consists of 2 steps: display the object (an image) for 1 second, then display the object plus a label (some text) for 2 seconds. There are several ways you could do this in jsPsych, most obviously using the `image-keyboard-response` and `image-button-response` plugins - since we will need buttons later, I am going to use the `image-button-response` plugin.

Again, the simplest way to do this would be to construct each sub-part of each trial as a stand-alone thing, and then stick them together into a timeline. For instance, if I want to show `object4` (a shiny cylinder thing) paired with the label 'bup' then the label 'cav' I could do something like this:

```js
var observation_object4_only = {type:'image-button-response',
                          stimulus:'images/object4.jpg',
                          choices:[],
                          trial_duration:1000}
var observation_object4_bup = {type:'image-button-response',
                              stimulus:'images/object4.jpg',
                              choices:[],
                              prompt:'bup',
                              trial_duration:2000}
var observation_object4_cav = {type:'image-button-response',
                              stimulus:'images/object4.jpg',
                              choices:[],
                              prompt:'cav',
                              trial_duration:2000}

var simple_observation_timeline = [observation_object4_only,  
                                    observation_object4_bup,
                                    observation_object4_only, observation_object4_cav]
```
Then if we run that `simple_observation_timeline` we will get the trial sequence we want.

A couple of things to note here. First, my `choices` are set to `[]` (an empty array), which means the participant cannot provide a response (there are no buttons shown on screen)- that's fine, since we just want them to watch a learn. The `stimulus` parameter points to a particular image file, in the `images` folder, which you will see matches the directory structure I am using - keeping your stimuli separate from your code keeps things nice and neat and is essential if you are building an experiment with hundreds or thousands of stimuli. I am using the `prompt` to show the label beneath the object - the Ferdinand paper shows the label *above* the object, but there is no built-in jsPsych plugin that does that, so rather than hacking about with the plugin code I am just showing the label underneath (it surely doesn't matter anyway).

This would work OK, but it has a couple of drawbacks. Firstly, the fact that the `observation_object4_only` trial lacks a prompt means that things will jump about a bit on the screen - the object will move up when the experiment reaches the trials with labels, to make space for the prompt, which is quite unpleasant to look at. This is actually easily fixed by including some *dummy text* as a prompt on those trials - then every trial has a prompt, and so things don't jump around on-screen so much. So we could do that like this, using `'&nbsp;'` which is a special whitespace character in HTML that will give us a blank prompt:

```js
var observation_object4_only = {type:'image-button-response',
                              stimulus:'images/object4.jpg',
                              choices:[],
                              prompt:'&nbsp;', //dummy text
                              trial_duration:1000}
```

The more important problem with this simple approach, like I said in connection with the self-paced reading experiment, is that building this flat timeline is going to be very laborious and redundant for an experiment involving more than a few observation trials, and quite error prone (even writing this little example I forgot to change the `prompt` for the second trial from bup to cav), and there is no easy way to randomise the trial list without hopelessly scrambling everything. So instead I am adopting the same approach as in the self-paced reading experiment: using nested timelines to tie together the sub-parts of a single trial, and wrapping the whole thing in a function that builds a single observation trial for us. The code for that is as follows:

```js
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
```

So this bit of code creates a function, called `make_observation_trial` - we specify the object and the label and it does the rest for us, returning a complex trial with a nested timeline containing the two sub-parts (object only, then object plus label).

A couple of things to note here:
- It is going to be annoying to have to specify the full path of the image files every time we use this function, so instead I am just going to specify what object we want (e.g. `'object4'`) and the code works out what the filename will be (it sticks the directory name on the front and the .jpg extension on the end).
- The trial has a nested timeline - the toplevel specifies the common properties shared by all trials (`type`, `stimulus`, null `choices`), then for each sub-trial in the nested timeline we specify the bits that vary (the first sub-trial has a dummy prompt and a duration of 1000ms, the second has the label as the prompt and a longer duration).
- For the second sub-trial I have also specified something for the `data` parameter - it says

```js
data:{block:'observation'}
```

`{block:'observation'}` is javascript notation for a dictionary, which says basically "create a data structure with labelled entries; one of those entries is called block, and make its contents equal to the string 'observation'". This is the format that jsPsych expects `data` entries to be - dictionaries - and jsPsych will happily add to the starting data we have given it, adding the stimulus, trial duration etc like it always does. But now we have a way of spotting observation trials in the data that jsPsych generates - we just search for data items which have the `block` property set to `'observation'`. This might seem a bit mysterious but it will come in handy later.


## References

- [Ferdinand, V., Kirby, S., & Smith, K. (2019). The cognitive roots of regularization in language.
*Cognition, 184,* 53-68.](https://doi.org/10.1016/j.cognition.2018.12.002)

## Re-use

All aspects of this work are licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).
