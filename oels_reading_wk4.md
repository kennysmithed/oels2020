---
title: Week 4 reading
description: Self-paced reading
---

## The plan for week 4

This week we are looking at a paper on self-paced reading (Enochsen & Culbertson, 2015). In a self-paced reading experiment participants read sentences word by word, and you are interested in where they are slowed down, with slowing indicating processing difficulties and potentially telling you something about e.g. lexical representations or the structure of the grammar involved. Then in this week's practical you'll get a chance to look at a simple self-paced reading experiment in jsPsych.


## Reading tasks for this week

Read:
- [Enochson, K., & Culbertson, J. (2015). Collecting Psycholinguistic Response Time Data Using Amazon Mechanical Turk.
*PLoS ONE, 10,* e0116946.](https://doi.org/10.1371/journal.pone.0116946)

As you read this paper and make note of any questions, criticisms or ideas it gives you, and be prepared to discuss these in our reading group session. Once you have read the paper, you also need to work through [this week's practical task](oels_practical_wk4.md).

A couple of things to note as you work through the paper:
- Similarly to last week's reading on grammaticality judgments, this is another "does it replicate on MTurk” paper - this will be the last of these for a while, the next few papers we will look at happen to use online data collection, but are not primarily motivated by that.
- The second author, [Dr Jenny Culbertson](https://jennifer-culbertson.github.io), is based in Linguistics at Edinburgh now, doing very interesting work on learning, use, and language typology.
- This is a slightly older MTurk paper, so the rate of pay ($1 for 20 minutes) is way below what we would typically pay now.
- The paper mentions other options for RT experiments - Webexp, ibex farm - and they use something called ScriptingRT which generates a Flash movie. Flash is a dead format now, unsupported by most browsers, I don't know about Webexp and ibex, but we are going to be doing this stuff in jsPsych.
- The plots and statistics in the paper use *residual reading time* rather than raw reading time - this is a way of extracting factors that vary systematically across participants (e.g. fast vs slow readers) and words (e.g. long vs short words), to leave a cleaner signal of the reading time effects you are interested in. As you'd expect, positive residual reading time means a particular word is read relatively slowly, negative indicate it is read relatively quickly.  
- For Experiment 2 there is focus on running exactly 82 participants. Being in the right ballpark is nice for comparability, but it's usually not important to run exactly the same number, and sometimes (e.g. if you think the original study didn't run enough) you might actively want to diverge from the study you are replicating.
- They recommend using the Masters qualification on MTurk as a way of improving data quality. I have never used it - MTurk substantially increased their fees since this paper was written, and the Masters qualification costs extra, plus I was concerned about who exactly has the Masters qualification (e.g. are they unusually non-naive participants?). But there are other ways to select more reliable workers on MTurk, which we will cover in the final week - these days I always set a minimum number of completed HITs and a minimum acceptance rate. I don't know if this substantially improves the quality of the data but it definitely reduces the number of emails you field from participants who time out on your experiment, have some unfortunate episode occur which prevents them from completing it, etc. 
- They recommend running small batches on MTurk. I actually find that very small batches (e.g. 4-5 assignments) go more slowly, but batch size on MTurk influences costs (batches of 10+ assignments are charged at a higher rate), so I normally end up running multiple batches of 9.

## Re-use

All aspects of this work are licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).
