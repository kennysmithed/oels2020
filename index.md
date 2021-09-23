
# Be aware, this is the 2020-2021 version of this course

The code in this course uses jsPsych 6.1.0, so you will find that the code does not function as intended with later versions of jsPsych - in particular, later versions of jsPsych have slightly different names for some kinds of data that plugins return (`button_pressed` has become `response`), so if you want to use this code as-is download version 6.1.0 from [the jsPsych github page](https://github.com/jspsych/jsPsych/releases/tag/v6.1.0). 

[The 2021-2022 version of the course](https://kennysmithed.github.io/oels2021/) is now available (in-progress as of mid-September 2021) and jsPsych 6.3 compatible versions of all experiments will appear there as the course unfolds; the materials will be complete by late November 2021.


# The original 2020-2021 pages start here

This is the webpage for the Honours/MSc Guided Research course Online Experiments for Language Scientists, running in academic year 2020/2021. I will add links to materials (readings, code) to this page; you will need to use Learn for electronic submission of your assessed work, to keep an eye on announcements, and participate in discussion boards.

## Course summary

Many areas in the language sciences rely on collecting data from human participants, from grammaticality judgments to behavioural responses (key presses, mouse clicks, spoken responses). While data collection traditionally takes place face-to-face, recent years have seen an explosion in the use of online data collection: participants take part remotely, providing responses through a survey tool or custom experimental software running in their web browser, with surveys or experiments often being advertised on crowdsourcing websites like Amazon Mechanical Turk (MTurk) or Prolific. Online methods potentially allow rapid and low-effort collection of large samples, and are particularly useful in situations where face-to-face data collection is not possible (e.g. during a pandemic); however, building and running these experiments poses challenges that differ from lab-based methods.

This course will provide a rapid tour of online experimental methods in the language sciences, covering a range of paradigms, from survey-like responses (e.g. as required for grammaticality judgments) through more standard psycholinguistic methods (button presses, mouse clicks) up to more ambitious and challenging techniques (e.g. voice recording, real-time interaction through text and/or streaming audio, iterated learning). Each week we will read a paper detailing a study using online methods, and look at code (written in javascript using jspsych) to implement a similar experiment - the examples will skew towards the topics I am interested in (language learning, communication, language evolution), but we'll cover more standard paradigms too (grammaticality judgments, self-paced reading) and the techniques are fairly general anyway. We’ll also look at the main platforms for reaching paid participants, e.g. MTurk and Prolific, and discuss some of the challenges around data quality and the ethics of running on those platforms.

No prior experience in coding is assumed, but you have to be prepared to dive in and try things out; the assessment will involve elements of both literature review and coding.

## Staffing

[Kenny Smith](http://www.lel.ed.ac.uk/~kenny/) (that's me) is the 'lecturer' (I won't be lecturing) for this Guided Research option. Best way to get in touch with me is in one of the live sessions, see below, or by email to [kenny.smith@ed.ac.uk](mailto:kenny.smith@ed.ac.uk).

## Class times

We have class 10am-11am Wednesday, Thursday and Friday. We will meet on Microsoft Teams, I have added all enrolled students to the course Team. If you can't access Teams or can't find the class meeting, email Kenny.

Wednesday 10-11 is the main class meeting, in the form of a reading group - we will discuss the week's reading and cover any questions, comments, thoughts you have.

Thursday and Friday 10-11 are drop-in labs, you can come along any time in those hours and I will be available to help you through any difficulties you are having with the practical element of the course.

## Assessment

Two pieces, due on 12th November and 17th December, full details in [the assignment brief](AssignmentBrief.pdf).

## Course Materials

Course content will appear here as we work through the course.

Each week there will be a set reading and a programming assignment. The reading involves a blog post introducing a published paper, you read both the blog and the paper. The programming assignment involves working through a section of the [Online Experiments with jsPsych](https://softdev.ppls.ed.ac.uk/online_experiments/index.html) tutorial and then looking at (and possibly editing) some code using those concepts to implement a language-related experiment. We have two opportunities each week to meet as a class - a seminar where we can discuss the paper, and a drop-in lab where you can come along and get help with any programming difficulties or questions you have.

### Week 1 (commencing 21st September): No class

But make an early start on the reading and programming for week 2.

### Week 2 (28th September): Running experiments online: why and how

- *Scientific content:* lab vs online data collection
- *Technical content:* jspsych basics, intro to crowdsourcing platforms
- [Reading](oels_reading_wk2.md)
- [Programming task](oels_practical_wk2.md)

### Week 3 (5th October): Grammaticality judgements

- *Scientific content:* lab vs online grammaticality judgments; syntactic processing and acceptability
- *Technical content:* simple key- and button-press responses
- [Reading](oels_reading_wk3.md)
- [Programming task](oels_practical_wk3.md)

### Week 4 (12th October): Self-paced reading

- *Scientific content:* processing costs of syntactic dependencies
- *Technical content:* collecting reaction time data, more complex nested trials
- [Reading](oels_reading_wk4.md)
- [Programming task](oels_practical_wk4.md)

### Week 5 (19th October): No class

You could use the opportunity for catchup or lookahead reading.

### Week 6 (26th October): Word learning / frequency learning

- *Scientific content:* probability matching and regularisation
- *Technical content:* using trial data for contingent trials, filtering and saving data
- [Reading](oels_reading_wk6.md)
- [Programming task](oels_practical_wk6.md)

### Week 7 (2nd November): Audio stimuli

- *Scientific content:* speech perception, social influences on phonetic adaptation
- *Technical content:* Audio, trial data again, saving data trial by trial
- [Reading](oels_reading_wk7.md)
- [Programming task](oels_practical_wk7.md)

### Week 8 (9th November): Confederate priming

- *Scientific content:* syntactic priming and alignment<br>
- *Technical content:*  Audio recording, more randomisation stuff, custom preload lists, reading trial lists from CSV
- [Reading](oels_reading_wk8.md)
- [Programming task](oels_practical_wk8.md)

### Week 9 (16th November): Participant-to-participant interaction

- *Scientific content:* least effort and Zipf's Law of Abbreviation
- *Technical content:* web sockets, python servers, incrementally building a timeline
- [Reading](oels_reading_wk9.md)
- [Programming task](oels_practical_wk9.md)

### Week 10 (23rd November): Iterated Learning

- *Scientific content:* iterated learning and the evolution of compositional structure
- *Technical content:* reading trial lists from CSVs again, PHP scripts for iteration
- [Reading](oels_reading_wk10.md)
- [Programming task](oels_practical_wk10.md)

### Week 11 (30th November): Interacting with MTurk

- *Scientific content:* None!
- *Technical content:* How to set up a server, launch and pay participants, manage qualifications, etc
- [Combined reading/practical: how to get your experiment online](oels_wk11.md)

### Planned changes

I am maintaining [this list of planned changes](https://docs.google.com/document/d/1Hv_oNtwNdd5SLHMhBF3-lKAEwee2xI0p4Mm2LR2GRFw/edit?usp=sharing) for next year, if you have suggestions I am all ears, just email me.

## Re-use

All aspects of this work are licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).
