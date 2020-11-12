---
title: Week 9 practical
description: web sockets, python servers
---

## The plan for week 9 practical

This week we are going to look at code for a dyadic interaction task based on the Combined condition of the experiment described in Kanwal et al. (2017). There's no new material to look at in the Online Experiments with jsPsych tutorial.

In terms of the trial types we need to present to participants, this experiment is actually very simple, and uses elements of the code we developed in the practicals on word learning and perceptual learning.
- Participants go through an initial observation phase where they are exposed to two objects paired with short and long labels. This is basically identical to the observation phase of the word learning experiment in word_learning.js.
- When communicating with their partner, participants sometimes act as what I'll call the *director* - they are presented with an object and asked to select one of two labels to send to their partner. This is very similar to the production trial phase in the word learning experiment. The only difference is that we need to add a manipulation of production effort, making the longer labels more onerous to send. I explain how we do that below.
- When communicating with their partner, participants sometimes act as the *matcher* - they are presented with a label and asked to select one of two objects which they think their partner is labelling. This is very similar to the picture selection trials in the perceptual learning experiment, except that we are just using a text label rather than an audio file.

However, there is one substantial complication: rather than participants completing this experiment individually, they play in pairs, sending messages back and forth. We therefore need some infrastructure to allow two participants, sitting on web browsers anywhere in the world, to interact via the restricted communication channel we provide. The code for this isn't actually too complicated - I figured it out! - but as per last week, I am going to hide most of the detail from you; the code is available and commented if you want to look at it or edit it, but you don't have to. Instead I'll try to explain to you how it works, at a conceptual level, and you can take the details on trust until you need to build a similar experiment yourself.

Remember, as usual the idea is that you do as much of this as you can on your own (might be none of it, might be all of it) and then come to the practical drop-in sessions or use the chat on Teams to get help with stuff you need help with.

## A dyadic interaction experiment

### Getting started

You need a bunch of files for this experiment - an html file, a few js files, some images, and then a folder containing some python code (this is where most of the magic happens). Download the following zip file and then uncompress it into your usual jspsych folder:
- <a href="code/dyadic_interactionzip" download> Download dyadic_interactionzip.zip</a>

You need to extract these files to a folder called `dyadic_interaction`, alongside your various other experiment folders and your `jspsych-6.1.0` folder.

This code should actually run OK on your local computer, but it won;t save your data if you run it locally - so to get the full experience, you need to upload the whole `dyadic_interaction` folder to your `public_html` folder on the jspsychlearning server and play with it there. Furthermore, there is one tweak you need to make before your data will save:
- You need to edit `save_data.php` so that it points to *your* `server_data` folder rather than mine. Open those files in an editor and change the path `/home/ksmith7/server_data/` to `/home/UUN/server_data/` where UUN is your UUN.

Once you have done that you can open `dyadic_interaction.html` in your web browser if you are running it locally, or go to http://jspsychlearning.ppls.ed.ac.uk/~UUN/dyadic_interaction/dyadic_interaction.html if you want to run it on the server. And this time, rather than runnnin it in one window, you will need to open the same code in *two* windows (both on your computer is fine, or you can play with a friend if you are running it on the server) - it's a dyadic game, it needs two players!

First, get the code and run through it so you can see what it does. Then read on. For this week I am going to focus on the conceptual level of how the dyadic interaction happens, and avoid stepping through the javascript in too much detail - like I said, most of it is re-used from earlier experiments anyway.

### Clients and servers for dyadic interaction

In prep

## Exercises with the dyadic interaction experiment code

In prep


## References

[Kanwal, J., Smith, K., Culbertson, J., & Kirby, S. (2017). Zipf's Law of Abbreviation and the Principle of Least Effort: Language users optimise a miniature lexicon for efficient communication. *Cognition, 165*, 45-52.](https://doi.org/10.1016/j.cognition.2017.05.001)

## Re-use

All aspects of this work are licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).
