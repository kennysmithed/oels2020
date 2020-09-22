---
title: Week 3 practical
description: Simple button-press responses
---

## The plan for week 3 practical

This week we are going to look at a little bit more of the Online Experiments with jsPsych tutorial, and then look at code for a simple grammaticality judgment experiment. Remember, the idea is that you do as much of this as you can on your own (which might be all of it or might be none of it!) and then come to the practical drop-in sessions or use the discussion board to get help with stuff you need help with.

Some things to note as you work through the practical.

- We will be playing with code on the teaching server, `jspsychlearning.ppls.ed.ac.uk`. As soon as I have the class registration list I will ask the techies to create an account for you on there. Until they set that up, you won't be able to access it, but you can still read through the tutorial. Also, you need to be on the University network to log in to the server (to upload files etc) - see instructions in the [Week 2 reading page](oels_reading_wk2.md) on how to access the VPN.
- In section 02, the tutorial recommends using CyberDuck for uploading files to the server - I agree, it's very nice. Just to emphasise, *you don't need to pay for it*, although it will ask you if you'd like to ocasionally. I have bought a license because I use it a lot, if that helps assuage your guilt.
- In section 03 the tutorial runs through some potential editors you can use to view/edit code. I am using Atom on a Mac, it's OK - if you want to use that you might have to download it from [the Atom website](https://atom.io).
- Note that in the jsPsych "hello world" tutorial, the name of the directory they give for the jspsych code might not match the name of the directory for you. In the tutorial it says that you load the various bits of jsPsych code with code like `<script src="jspsych-6.0.5/jspsych.js"></script>`, but for me the downloaded jspsych code is actually in a directory called `jspsych-6` so I had to edit that script call to read `<script src="jspsych-6/jspsych.js"></script>`, just so the browser is looking in the right place. If you try to run the hello world tutorial code and get a bunch of errors telling you that it can't find certain files, this might be the problem.

## Practical tasks for this week

### Tutorial content

Work through the rest of section 04 of the [Online Experiments with jsPsych tutorial](https://softdev.ppls.ed.ac.uk/online_experiments/index.html). It's up to you whether you want to do the exercises at the end of section 04 or not. The key things you need to take away from the tutorial are:
- Displaying results on-screen at the end of the experiment.
- Key codes for keyboard-response trials.
- The gist of timeline variables - we won't be doing anything with factorial designs, but we will do a very simple kind of timeline variable in the more advanced version of today's code.

### A grammaticality judgment experiment

After you have looked at section 04 of the tutorial you should know just enough to make sense of a very simple grammaticality judgment experiment. You can download the code for this experiment here: LINK. Note that you need to download `grammaticality_judgments.html` and `grammaticality_judgments.js`. You can put them wherever, but I would suggest creating a directory called grammaticality_judgments and them saving them in there, to keep everything nice and neat. This code should run on your local computer (just open the `grammaticality_judgments.html` file in your browser) or you can upload it to the teaching server and play with it there.

First, get the code and run through it so you can check it runs, and you can see what it does. Then take a look at the HTMl and JS files in your code editor (e.g. Atom).

You will see that `grammaticality_judgments.html` doesn't have much in it - all that does is load a few javascript scripts, including the plugins we will need, and the file `grammaticality_judgments.js`.

The bulk of the code is in `grammaticality_judgments.js`. You will see that that code includes *comments* - these are bits of text that are enclosed in special markers so that the machine running the code ignores them. They are intended for you to read, to explain what the code is doing. But I'll also add some explanation here.

`grammaticality_judgments.js` is probably one of the simplest types of experiments you could build. It has 4 grammaticality judgment trials, where participants provide a keypress response (y or n for "yes, this sentence could be spoken by a native speaker of English" or "no, it could not"). There is also a little bit of wrapper around those 4 trials - a consent screen and some information screens before the experiment proper starts, and then a final screen where you can display debrief information, completion codes etc to participants.

The code starts by laying out the grammaticality judgment trials (just because they come first in the file doesn't mean they will be the first thing the participant sees - the timeline controls what participants see when). Each trial involves showing the participant a sentence and getting a single keypress response from them, which we can achieve using the html-keyboard-response plugin. Details of the options for that plugin are in the [jsPsych documentation](https://www.jspsych.org/plugins/jspsych-html-keyboard-response/). We are using the `stimulus` parameter to hold the sentence the participant is judging, `prompt` reminds the participant what they are supposed to be doing, and `choices` shows the list of keyboard responses they are allowed to provide - in this case we only accept y or n keypresses, so everything else is ignored. So one judgment trial looks like this:

```js
var judgment_trial_1 = {
    type: 'html-keyboard-response',
    stimulus: "Where did Blake buy the hat?",
    prompt: "<p><em>Could this sentence be spoken by a native speaker of English? Press y or n</em></p>",
    choices: ['y','n']
}
```

The code defines 4 such trials, inspired by the type of sentences used in Sprouse (2011).

That's basically the interesting part of the code! But we also need some preamble for the participants. Most experiments start with a consent screen, where participants read study information and then consent to participate. I do this using the button-response plugin - you see the consent information and then click a button to indicate that you consent. The code for that looks as follows:

```js
var consent_screen = {
  type: 'html-button-response',
  stimulus: "<h3>Welcome to the experiment</h3>\
  <p style='text-align:left'>Experiments begin with an information sheet that explains to the participant\
  what they will be doing, how their data will be used, and how they will be\
  remunerated.</p>\
  <p style='text-align:left'>This is a placeholder for that information, which is normally reviewed\
  as part of the ethical review process.</p>",
  choices: ['Yes, I consent to participate'],
}
```

You will notice that the `stimulus` parameter here is quite complicated - it includes some HTML markup, including tags for headers (`<h3>` and `</h3>` to start and end a header), and paragraphs (`<p>` ... `</p>`). By default, jsPsych centres all text, which sometimes looks fine (e.g. for the judgment trials, where we *want* the stimulus to be centred) but it looks horrendous for instruction text, so I also tell it to left-align that text, by adding some stuff inside the paragraph tags - so I start a left-aligned paragraph like this: `<p style='text-align:left'>`, then end it with `</p>` as usual). Finally, the `choices` parameter for this trial type is a list of button labels - lists are enclosed in square brackets, here the list contains exactly one option with the "yes I consent" text, which produces a screen with exactly one button to be clicked. Finally, I have to use a `\` character whenever I want to include a line break in the stimulus string, otherwise javascript thinks there is a syntax error.

I also define some information screens - these are `html-keyboard-response` trials, just like the judgment trials, but since I haven't specified a restricted range of valid responses in the `choices` parameter, any key press will move the participant to the next trial. So for example the first instruction screen looks like this:

```js
var instruction_screen_1 = {
  type: 'html-keyboard-response',
  stimulus: "<h3>Instructions</h3> \
  <p style='text-align:left'>In this experiment you will read English sentences, and determine if they sound\
  grammatical to you. By grammatical, we mean whether you think a native speaker of\
  English could say this sentence in a conversation. In other words, do you think it\
  would sound odd for your friends to say this to you, as if they don't speak English natively?</p>\
  <p style='text-align:left'>We are <b>not</b> concerned with whether the sentence would be graded highly\
  by a writing teacher: we do not care about points of style or clarity, and we do\
  not care about the grammar rules that you learned in school (who versus whom,\
  ending a sentence with a preposition, etc). Instead, we are interested in whether\
  these sentences could be said by a native speaker of English in normal daily speech.</p>\
  <p>Press any key for more instructions.</p>"
}
```

Once all the various trials are defined, we can stick them together in a timeline for the experiment. The timeline is very simple and is just a list of all the trial variables we have created up to this point:
```js
var full_timeline = [consent_screen,instruction_screen_1,instruction_screen_2,
                    judgment_trial_1,judgment_trial_2,judgment_trial_3,judgment_trial_4,
                    final_screen]
```

Then to run the experiment we call `jsPsych.init` with this `full_timeline` variable we have created, and tell it to show the raw data on-screen at the end of the experiment (using the `on_finish` parameter of `jsPsych.init`):

```js
jsPsych.init({
    timeline: full_timeline,
    on_finish: function(){jsPsych.data.displayData('csv')}
})
```
Obviously in a real experiment you would save the data rather than just showing it back to the participant, but we haven't quite got there yet!


## Re-use

All aspects of this work are licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).
