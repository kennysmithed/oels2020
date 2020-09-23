---
title: Week 2 reading
description: Running experiments online, why and how
---

## The plan for week 2

Week 2 is our first week of actual content. The reading in week 2 is designed to give you a brief intro to why people collect data online, advantages and shortcomings, to lay out some of the options in terms of how to build experiments and what platforms people use to connect with participants, and to give you a feel for what online experiments can look like (focussing on my experiments). There is a set reading for this week, but also the blog post (this document) is longer than usual, because there are quite a few threads to pull together.

For [the practical component of week 2](oels_practical_wk2.md) we'll help you get set up with jsPsych, and learn enough of the basics so we can jump in to building simple experiments in week 3.

## A note on accessing readings

I will link to readings that you can access on the Edinburgh University network (e.g. in journals which are open access, or for which the University pays a subscription). Obviously we are not all *on* the University network at the moment - I am writing this sitting in the spare room at home in lovely Dunbar - and not all these links will work from your home network. The work-around is to log onto the University's VPN (Virtual Private Network), at which point you are treated as being on the University network and have access to the journal websites. [Here are the instructions for getting on the VPN.](https://www.ed.ac.uk/information-services/computing/desktop-personal/vpn) Note that you will also need to be on the VPN to access the experiment server for practicals.

Don't forget to disconnect from the VPN once you have what you need, otherwise all your web traffic goes through the University which might slow you down or get you in trouble if you are doing things you wouldn't do on a public computer in the library.

## Collecting data online

Various kinds of linguistic and psycholinguistic research need data from humans - you need to know whether a certain construction is grammatical or not, how people from a certain region pronounce a certain word, whether there is variation within a community in a certain linguistic feature, how hard a particular type of sentence is to process, whether a particular type of word meaning is easy or hard to learn, how people deploy their linguistic system in interaction with others, etc etc.  Until relatively recently, this kind of data has been collected in person - you ask colleagues or students for their grammaticality judgments, record people speaking, bring people into your lab to run psycholinguistic experiments on your lab computers, or have pairs or groups of participants interact in person on shared tasks.

However, in recent years there's been an accelerating move to collect at least some of these kinds of data online: rather than going out yourself to track down participants and elicit data, or having them come into the lab and run through an experiment, you have them participate remotely. While this could be done in the old days too - I could write you a letter to solicit your opinion on the grammaticality of some sentences, or phone you up to listen to how you speak - collecting data over the internet massively accelerates this process, and makes large-scale online data collection feasible. In the canonical case, your participants simply participate in their web browser - you point participants to a URL and their browser runs code you have written to solicit certain kinds of data.

Collecting data in this way therefore involves a couple of important steps which differ from in-person studies - connecting with participants, and building an experiment that runs in a web browser.

### Connecting with participants

If you are doing data collection in person this is usually fairly obvious - you pop next door to your colleague, turn up at your field site with a recorder and some local contacts to chase down, or flyer the campus to recruit participants for your lab study. These methods are also possible with online data collection - if you have built your experiment to run in a web browser you can email the URL to colleagues and friends, turn up at your field site and have someone speak into your laptop, or have participants come into the lab and do the experiment on a browser on your lab machine. But obviously the real power of online data collection comes from connecting with participants remotely - ideally your software will work on any web browser which means you can in principle reach anyone in the world with an internet-enabled device and internet access, which is an enormous potential participant pool. Of course the trick is knowing how to reach those people.

There are a range of ways to do this. For instance, [Hartshorn et al. 2018](https://www.sciencedirect.com/science/article/abs/pii/S0010027718300994) set up a grammar quiz that went viral on social media and ended up with over a million responses (it's still going strong even after that 2018 paper was published). I wouldn't count on any of your experiments going viral though. The more standard route is to pay people to participate. You could do that manually by putting your study URL on flyers and then reimbursing people using paypal - we've done that, it's laborious but it works. The more efficient and powerful approach is to recruit through websites which are designed to facilitate [crowdsourcing](https://en.wikipedia.org/wiki/Crowdsourcing). These sites allow you to set paid tasks for members of the public. The sites have a pool of people looking for tasks, and provide an infrastructure for paying people. In return they charge you a fee, which is often quite substantial (e.g. MTurk charges an additional 20-40% of the amount you pay the participants, Prolific charges 33%). The most widely used site is [Amazon Mechanical Turk (MTurk)](https://www.mturk.com), although [Prolific](https://www.prolific.co) has a growing following in academia (at least in the UK), and less of a Wild West reputation. I mainly use MTurk, I used Prolific for the first time recently and was impressed (no idea about data quality yet but there is a nice interface on the website, plus the data seems to come in just as fast as it does on MTurk).

We'll cover the details of how to interact with these crowdsourcing sites in the final week of the course, but to summarise: once your data-collection website is all built and tested you pay for credit on one of these sites, list your experiment as an assignment or series of assignments, and like magic people come along and complete it. Or that's the theory - in practice often people come along and tell you they can't complete your experiment because it contains a bug you didn't catch, or they complete it in a way you hadn't anticipated, you revise and repeat until you have a working experiment, and then the data comes rolling in.

### Building an experiment that runs in a web browser

If you are doing data collection in person you can sometimes get away with a low-tech approach - paper-and-pencil surveys, voice recording on a handheld recorder, etc. For some kinds of online data collection you might also be able to go low-tech - for instance, maybe you can just get people to email your their judgments, or interview people over Skype/Teams/Zoom. But for the kinds of methods we are interested in, that won't work and you are going to need to get your hands dirty and build an experiment that runs in a web browser.

Luckily lots of people want to do this, so there are a range of tools available that you can use. Some of these apparently have quite simple interfaces, which allow you to build a survey or experiment with relatively little technical knowledge, using point-and-click interfaces - options here include [Qualtrics](https://edinburgh.eu.qualtrics.com), [Gorilla](https://gorilla.sc/) and [Psychopy](https://www.psychopy.org). Point-and-click interfaces make it quick and easy to pull something together, but these tools often limit what you can do, and anything other than a very standard-looking paradigm might be hard or impossible to achieve. The other extreme involves writing stuff from scratch in html and javascript (a programming language that runs in browsers), which is what I normally do - then you can basically do anything you can figure out how to code up, but the problem is you have to figure it out yourself from scratch / by trawling through Stack Overflow (a website where programming questions are posted and answered which seems to contain the answer to all common programming problems).

On this course we are going to go for a middle route, which is to build our experiments using [jsPsych](https://www.jspsych.org). jsPsych is a set of tools for javascript, created by [Josh de Leeuw](https://www.vassar.edu/faculty/jdeleeuw/). Building an experiment in jsPsych involves doing a bit of html and javascript, but with tools to make the kinds of things you'll probably want to do a lot easier than coding from scratch - it's designed by cognitive scientists for cognitive scientists, so lots of the things we will want to do are covered as standard. Even better, our in-house PPLS programming guru [Alisdair Tullo](https://www.ed.ac.uk/profile/alisdair-tullo) has written [a nice intro course](https://softdev.ppls.ed.ac.uk/online_experiments/index.html) for us to use, which introduces many of the tools we'll need to get started. Hopefully this makes the programming part of the course fairly accessible (and I am on hand to help you!), but gives us the flexibility to build quite fancy experiments.

The plan for this course is that you will work through bits of Alisdair's tutorial, which will give you enough javascript and jsPsych to read and play with my jsPsych implementation of interesting psycholinguistic experiments; those experiments are based on the experiments we cover in the readings. You won't be expected to build experiments from scratch on your own, but ideally by the end of the course you'll have some template experiments for inspiration and enough knowledge to understand how you could go about repurposing them to cover your data collection needs.

## Why collect data online?

### Advantages

At this point you might be thinking "Hmm, this sounds like hard work, why do I want to do this at all?". There are a number of advantages of online data collection though.

One obvious advantage is that it allows you to collect data without interacting with people face to face, like in the middle of a pandemic. That's quite a big deal at the moment.

Setting the pandemic aside, in normal times the most obvious advantage from my perspective is that online data collection is *fast*. In-person data collection is limited by the time of the person collecting data, the size of your lab, and the size of your participant pool. For example, when I run stuff in the lab I know that I can only book the lab for about 16 hours a week, and I can only test 4 people at once (the lab only has 4 booths) - that means the maximum number of people I could run through a 1-hour experiment is 16x4=64 people in a week. That's actually pretty good, but I also know that in practice I can almost never recruit enough people from our participant population to be running at capacity all week, and even the people who sign up often don't show up, so in practice we might spend 16 hours in the lab and collect data from 20 people, and that would be a solid week. Worse, beceause we don't want to re-use participants across experiments we often end up with a smaller effective participant pool, and then things can really start to drag. In contrast, I know I can run basically as many people online as I want - I have never run more than 50 in a day, but that's just because I have chosen not to, and I know people who run hundreds of participants in a few hours. And because the participant pool is much much larger cross-experiment exclusions are not a problem, and data collection doesn't slow down because you don't start running out of naive participants.

There are other advantages too, although these have mattered less to me in my research. The populations you access in crowdsourcing sites are different from and a bit more diverse than University populations, which might matter to you. You can potentially tap into larger populations of participants who have native languages other than English (e.g. Spanish speakers, Hindi speakers). You can definitely access older participants than you will get by flyering the student union.

One thing to flag up at this point is the thorny issue of payment. You will often see authors mentioning *affordability* as a major advantage of online data collection, particularly in the older papers we look at. One of the features of the early days of crowdsourcing in cognitive science was (in hindsight) a very thoughtless approach to participant payment. Typically in the lab we pay people at or above the local minimum wage, or participants are students who participate for free but extract educational value from participating (e.g. learning what experiments look like and what participant handling feels like to the participant). MTurk does not specify a minimum payment rate (although Prolific does), and as a result many early studies used shamefully low rates of pay, with effective rates of pay of $1-2 an hour. One of my own papers we will cover on the course (with data collected back in the bad old days of 2012) has a rate of pay I am now very ashamed of.

I am happy to say that my impression is that this payment issue is now resolving itself (although issues remain). *We* control what we pay participants, and in my group we now pay at UK minimum wage equivalents, which is what we'd pay in the lab and which makes our studies very well-paid on sites like MTurk. Because of the fees sites like MTurk charge, and the fact that you often end up running more participants, online studies in my experience therefore end up being *more* expensive than lab studies. I get the impression that more cognitive science researchers are moving in this direction too, and that the shockingly low early rates of pay were driven in part by a failure to understand who our online participants were and why they were participating (probably combined with a motivated lack of curiosity about what was going on behind all this cheap data). I think many researchers in the early days thought that workers on crowdsourcing sites were essentially volunteers, taking part for fun with a small token payment as an added bonus. It turns out this is usually not the case, and for at least some crowd workers the money they make from these tasks is an important part of their household income. There are some insights on this in the readings below.

### Disdvantages

See above on cost - assuming you are paying your participants fairly, online experiments should be relatively expensive, not cheap, although	if you normally employ people to collect face-to-face data you need to factor in the time and money saved there.

Perhaps the most obvious disadvantage of collecting data online is that participants are participating remotely, so you have relatively little control over who they are and how they approach your task. For in-person data collection you can see who they are yourself, speak to them, keep an eye on them in the experiment booth, answer any questions they have on the spot, and wake them up if they fall asleep (happened to me once with a participant doing a very boring EEG experiment, you could tell from his brain activity he was having a nap, it was pretty funny but wasted 2 hours of lab time). But if they are participating remotely you have no idea where they are (at home? watching TV? on a packed commuter train?), who they are (are they really a native speaker of the language you are targeting? are they really in the age range you want?), or how they are doing the task (are they paying too little attention and	watching TV? are they paying too much attention and taking written notes when you don't want them to?). As a result one of the challenges of online experiments is figuring out ways to fairly filter out participants you don't want (e.g. non-native speakers, random clickers) and making it easy for them to participate in the ways you do want (e.g. attending to each trial, providing rapid responses, or providing slower considered responses).

The population you are sampling from in an online experiment and the environment the participants are participating in is therefore quite different to a traditional lab study. As a result there has been some concern about whether results obtained in the lab will replicate online. The obvious solution to this is to check, and several of the papers we will look at in the first part of the course are about verifying that online data collection produces the same results as lab studies.

## Reading tasks for this week

There are several things to read/look at this week, to give you a feel for some of the issues around online vs lab data collection, demographics of online populations, what online experiments look like, and what a crowdsourcing site looks like from the participant's perspective.

Read:
- [The wikipedia page explaining what MTurk is.](https://en.wikipedia.org/wiki/Amazon_Mechanical_Turk)
- [Stewart, N., Chandler, J., & Paolacci, G. (2017). Crowdsourcing Samples in Cognitive Science.
*Trends in Cognitive Sciences, 21,* 736-748.](https://doi.org/10.1016/j.tics.2017.06.007)


Also read *at least one of*:
- [Monroe, R. et al. (2010). Crowdsourcing and language studies:
		the new generation of linguistic data. In *Proceedings of the NAACL HLT
			2010 Workshop on Creating Speech and Language Data with Amazon’s Mechanical Turk*,
			pages 122–130.](https://www.aclweb.org/anthology/W10-0719.pdf)
- [Pavlick, E. et al. (2014). The Language Demographics of Amazon
		Mechanical Turk. *Transactions of the Association for Computational
			Linguistics, 2,* 79-92.](https://www.aclweb.org/anthology/Q14-1007)
- [A blogpost listing some downsides of MTurk](https://blog.prolific.co/stop-using-mturk-for-research/),
		although note that this is written by people at Prolific, who are an
		MTurk competitor! Doesn't mean some of the points aren't valid though.
- [A 2018 article in The Atlantic on worker exploitation on MTurk](https://www.theatlantic.com/business/archive/2018/01/amazon-mechanical-turk/551192/),
		although remember that we at least control what we pay workers and
		how we treat them.

It might also help to have a look at:
- [A video of what the MTurk site looks like from a worker's perspective](images/mturk_hits_page.mp4).
- A couple of working experiments (of mine)
	- [A simple word learning experiment](https://blake4.ppls.ed.ac.uk/ksmith7/redup.html?), with novel objects and non-word labels. Participants are trained and tested on object-label pairs, we are interested in this case in whether people learn labels featuring repetition (e.g. wewe vs moga) better.
	- [A (very long) morphology learning experiment](https://blake4.ppls.ed.ac.uk/ksmith7/yesnosounds_v2.html) - you listen to inflected forms plus definitions, then at the end there's a recognition memory test, although I would *not* recommend going though the whole thing! We were interested in a particular theory (disproven!) about how different placement of irregular inflections might influence learning. I actually wrote this one in jsPsych.
	- [An in-development kinship vocabulary learning experiment](https://blake4.ppls.ed.ac.uk/ksmith7/yesnosounds_v2.html) - completely lacking in participant instructions at the moment, but you are introduced to a cast of characters and then try to learn the kinship vocabulary they use to address each other. We are interested in whether certain kinship terminologies are easier or harder to learn that others, and how people use those kinship systems in interaction.



## Re-use

All aspects of this work are licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).
