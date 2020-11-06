---
title: Week 8 practical
description: Audio recording, more randomisation stuff, custom preload lists, reading trial lists from CSV
---

## The plan for week 8 practical

This week we are going to look at code for a confederate priming experiment based on the experiment described in Loy & Smith (2020) (and in fact using some of our stimuli). There's no new material to look at in the Online Experiments with jsPsych tutorial. As in the perceptual learning experiment we use the `audio-button-response` plugin to play audio and get button-click responses from a participant when they are listening to the confederate. We need some new background infrastructure to get the participant to record their own spoken descriptions: we use `image-button-response` trials to have the participant look at an image, click a mic button to start recording audio, and then we call some behind-the-scenes functions that will record audio and save it to the server - you don't actually need to know how the audio recording code works, although it's all commented up. We are also going to add a few more bits and pieces involving randomisation (random participant IDs, random wait durations to simulate a human partner, random flipping of some image orientations), we'll build a custom preload list to make sure our button images are preloaded before the experiment starts, and finally I'll show how to load a trial list from a CSV file (handy if you don't want to have to specify how to build the trial list inside the jsPych code).

Remember, as usual the idea is that you do as much of this as you can on your own (might be none of it, might be all of it) and then come to the practical drop-in sessions or use the chat on Teams to get help with stuff you need help with.

## Acknowledgments

I cobbled together some audio recording code for the online experiments in Loy & Smith (2020); Annie Holz then jsPsych-ified it ([she has her own audio recording demo](https://experiments.ppls.ed.ac.uk/)), and I tweaked that code for this demo experiment.

For this demo experiment we are using audio stims produced by my RA Clem Ashton, who was the native English-speaking confederate in some experiments we ran (not actually those reported in the current draft of Loy & Smith, 2020, but some follow-ups).

## A confederate priming experiment

### Getting started

As usual, I'd like you to download and run the code I provide, look at how the code works, and then attempt the exercises below, which involve editing the code in simple ways.

You need a bunch of files for this experiment - as per last week, an html file, a js file, two php files (for saving CSV and audio data), and then various folders containing images, sounds, trial lists etc. Again, rather than downloading them individually, download the following zip file and then uncompress it into your usual jspsych folder:
- <a href="code/confederate_priming.zip" download> Download confederate_priming.zip</a>

Again, the code makes some assumptions about the directory structure it's going to live in - you need to extract these files to a folder called something like `confederate_priming`, alongside your `grammaticality_judgments`, `self_paced_reading`, `word_learning`, `perceptual_learning` and `jspsych-6.1.0` folders.

Like last week, this code will *not* run on your local computer - you need to upload the whole `confederate_priming` folder to your public_html folder on the jspsychlearning server and play with it there. Furthermore, there are a couple of things to tweak before you can run the code:
- You need to edit `save_data.php` and `save_audio.php` so that they point to *your* `server_data` folder rather than mine. Open those files in an editor and change the path `/home/ksmith7/server_data/` to `/home/UUN/server_data/` where UUN is your UUN.
- The code will save audio files to a subfolder of `server_data` called `audio` - so you need to create such a subfolder. You can create new folders in cyberduck quite easily.
- You will need to use Chrome for the audio to work reliably. Furthermore, you will have to change your Chrome settings to allow it to access the microphone. Quite sensibly, modern browsers have protections that prevent random websites accessing your microphone or camera in unsafe ways; the user always has to give permission, but also those resources are only available when the origin of the code (i.e. our server where the code lives) is secure, i.e. can be trusted to be who it says it is. Our `jspsychlearning` server is not set up like that at the moment, it lacks the necessary certificates, so we have to tell Chrome to trust it for audio recording purposes - obviously you wouldn't ask real participants to do this step, you'd have to set up a secure server for your code, but in our case it's only us trying out the code and we know it's nothing dodgy, so we can use this work-around. The way to do this is as follow the following 4 steps (which I got from [here](https://medium.com/@Carmichaelize/enabling-the-microphone-camera-in-chrome-for-local-unsecure-origins-9c90c3149339)).
  1. In chrome, follow this link to [chrome://flags/#unsafely-treat-insecure-origin-as-secure](chrome://flags/#unsafely-treat-insecure-origin-as-secure).
  2. Find and enable the `Insecure origins treated as secure` section.
  3. Add http://jspsychlearning.ppls.ed.ac.uk to the text box of origins you want to treat as secure.
  4. Close that window and restart Chrome.

Once you have done those various steps you are ready to try out the experiment. There are actually two versions of the experiment included in the zip file:
- A short version with a small number of trials. The code for this is in `confederate_priming.html` and `confederate_priming.js`, and the URL will be http://jspsychlearning.ppls.ed.ac.uk/~UUN/confederate_priming/confederate_priming.html if your directory structure is as suggested. This is the code I will start with in the explanation below.
- A full-length version with a large number of trials (100+). The code for this is in `confederate_priming_readfromcsv.html` and `confederate_priming_readfromcsv.js`, and the URL should be http://jspsychlearning.ppls.ed.ac.uk/~UUN/confederate_priming/confederate_priming_readfromcsv.html. If you want a longer demo you can run this, but the main purpose of including the second version is to show you how a long trial list can be read in from a CSV file.

First, get the code and run through it so you can see what it does. If you have problems with getting the audio to record to the server, get in touch with me! Then take a look at the HTML and js files in your code editor (e.g. Atom), and read on.

### Structure of the experiment

In preparation!

## References

[Joy, J. E., & Smith, K. (2020). Syntactic adaptation depends on perceived linguistic knowledge: Native English speakers differentially adapt to native and non-native confederates in dialogue. https://doi.org/10.31234/osf.io/pu2qa.](https://doi.org/10.31234/osf.io/pu2qa)

## Re-use

All aspects of this work are licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).
