---
title: Week 10 practical
description: reading trial lists from CSVs again, PHP scripts for iteration
---

## The plan for week 10 practical

This week we are going to look at code for an iterated learning experiment, a simplified version of the experiment described in Beckner et al. (2017). There's no new material to look at in the Online Experiments with jsPsych tutorial.

In terms of the trial types we need to present to participants, this experiment is actually very simple, and uses elements of the code we developed in the practicals on word learning, perceptual learning and dyadic interaction.
- Participants go through an initial observation phase where they are exposed to two objects paired with short and long labels. Again, this is basically identical to the observation phase of the word learning experiment in `word_learning.js`.
- In the final test, where participants try to reproduce the language they are trained on, participants are presented with an object and asked to produce a label/description for it. Beckner et al. used a free-typing production method, where people type stuff in. In some recent work with online iterated learning we (my RA Clem Ashton and I) switched to a more constrained production model:
participants are provided with a set of syllable options, and build complex labels by clicking on those syllable buttons. This reduces or removes the problem of participants typing English (e.g. "don't know", "no idea")
or near-English versions of random labels (e.g. "vukano" -> "volcano"), which we were getting a lot of with free-typed responses on MTurk. Anyway, the upshot is that I have made a new plugin, `image-button-buildlabel-response` which is like the standard `image-button-response` plugin but allows you to click multiple buttons and build up a label. We use that in the production trials.

The complication this week is that rather than pre-specifying the language participants have to learn, we are running an *iterated learning* design: the language produced by one participant in the production phase becomes the input language to another participant in the observation phase, allowing us to pass the language from person to person and watch it evolve. Participants are organised in *chains*, where the participant at generation n in a particular chain learns from the language produced by the generation n-1 participant in that chain.

There are a number of ways you could do this for an online experiment. You could write a python server, a bit like the one we used for dyadic interaction, that keeps track of which chains are running, which participants are in which chains, and then passes over the appropriate training data when a new participant starts the experiment. Or you can run a database on the server (in another language, SQL, designed for managing databases), that does the same kind of thing, keeping track of which chains are open, which participants are in which chain, and so on.

But here we are going to go for a low-tech approach, using CSV files on the server to store the languages participants are producing, and then using PHP scripts (just like the ones we use for saving data) to write to those files, moves files around to different folders, and so on. This hopefully means that we can get an iterated learning experiment up and running without any extra fancy bells and whistles. In fact, in the confederate priming code we already looked at reading CSV files from the server to build a trial list, so some of the principles involved here are the same (e.g. using asynchronous functions to make javascript wait while PHP is off reading a file from the server). Again, like last week, I won't bother you with the contents of the PHP files too much, and instead talk you through the code at a conceptual level, focussing on the jsPsych end of things.  

Remember, as usual the idea is that you do as much of this as you can on your own (might be none of it, might be all of it) and then come to the practical drop-in sessions or use the chat on Teams to get help with stuff you need help with.

## An iterated learning experiment

### Getting started

*Important note:* This experiment requires a bit of careful set-up in your `server_data` folder on the jspsychlearning server, so don't just download it and start running it - read below for instructions on how to set everything up, otherwise the code will behave strangely and you'll be confused!

You need a bunch of files for this experiment - an html file, a couple of js files, some images, and a bunch of php files. Download the following zip file and then uncompress it into your usual jspsych folder:
- <a href="code/iterated_learning.zip" download> Download iterated_learning.zip</a>

This code won't work on your local computer, it needs to be on the jspsychlearning server - so once you have extracted the zip file, you need to upload the whole `iterated_learning` folder to your `public_html` folder on the jspsychlearning server, alongside your various other experiment folders and your `jspsych-6.1.0` folder. Here's what my `public_html` folder looks like on cyberduck.

![my public_html folder](images/il_directory_structure.png)

You also need to tweak the `iterated_learning.js` code so it saves data to *your* `server_data` folder rather than mine. I have tried to make this more straightforward this week, so rather than messing with any of the PHP files, you can edit this in one place and it will work nicely everywhere. Open `iterated_learning.js` in an editor and find theline that says
```js
var myUUN = 'ksmith7'
```
In the version of the code I am looking at, that's around line 50. Then just swap my UUN (ksmith7) for yours - e.g. if your account name on the server is s1234567, change that line so it reads:
```js
var myUUN = 's1234567'
```

Finally, we need to set up some stuff in your `server_data` folder. Managing this iterated learning experiment means we need to keep track of several things. First, we want to record participant data trial-by-trial as it comes in, just like we also do. But we also need to keep track of which chains are available to iterate, which chains are currently being worked on by a participant, and which generations of which chains are completed and don't need to be messed with any more. We are going to manage that stuff by moving filers from folder to folder in `server_data`, so we need to set up those directories, and also drop in some starting languages to initialise our chains.

To do that, navigate into your `server_data` folder on cyberduck - you need to make sure that the folders you are creating inherit their access permissions etc from the main `server_data` folder, which you do by getting right into that folder on cyberduck before creating any new folders. So double-click the `server_data` folder so your navigation bar in cyberduck looks something like like this (but with your UUN rather than mine obviously)
![cyberduck in server_data](images/create_audio_folder.png)

Once you are there, create a new folder (Action ... New folder in cyberduck) and call that folder `il`. Then double-click to enter the `il` folder, and create *four* new folders in there, called `ready_to_iterate`, `undergoing_iteration`, `completed_iteration` and `participant_data`. Here's what my server_data folder looks like after that step - you can see the `il` directory with the 4 sub-directories. Note that you have to get the folder names exactly right, otherwise the code won't be able to find the stuff it needs.

![il directory structure](images/il_detailed_directory_structure.png)

We are going to use `participant_data` to save our trial-by-trial data like we usually do; the other 3 folders will be used to keep track of the state of each iterated learning chain.

Finally, we need to make some initial (generation 0) languages available. If you look in the `iterated_learning` directory you got from the zip file above, there's a sub-folder called `initial_languages_for_server_data`, containing two CSV files called `chain1_g0.csv` and `chain2_g0.csv`. Grab those and put them in the `ready_to_iterate` folder you just created in `server_data` - these are random languages that can server as the starting point for two iterated learning chains. Once you've done that, your `server_data` folder looks like this, and you are ready to go!

![il directory structure with initial languages](images/il_detailed_directory_structure_plus_g0.png)


### Managing an iterated learning experiment via PHP scripts

In prep!

## Exercises with the iterated learning experiment code

In prep!

## References

[Beckner, C., Pierrehumbert, J., & Hay, J. (2017). The emergence of linguistic structure in an online iterated learning task. *Journal of Language Evolution, 2*, 160–176.](https://doi.org/10.1093/jole/lzx001)

## Re-use

All aspects of this work are licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).
