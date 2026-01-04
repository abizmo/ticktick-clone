# Focus Feature - User Guide

> **Version:** 1.0.0  
> **Last Updated:** January 3, 2026

Welcome to the Focus Feature! This guide will help you get the most out of your productivity sessions using the Pomodoro Technique.

---

## Table of Contents

1. [What is the Pomodoro Technique?](#what-is-the-pomodoro-technique)
2. [Getting Started](#getting-started)
3. [Using the Focus Feature](#using-the-focus-feature)
4. [Customizing Settings](#customizing-settings)
5. [Session History](#session-history)
6. [Tips for Success](#tips-for-success)
7. [Troubleshooting](#troubleshooting)
8. [FAQ](#faq)

---

## What is the Pomodoro Technique?

The **Pomodoro Technique** is a time management method developed by Francesco Cirillo in the late 1980s. It uses a timer to break work into focused intervals, traditionally 25 minutes in length, separated by short breaks.

### How It Works

```
┌─────────────┐    ┌──────┐    ┌─────────────┐    ┌──────┐
│   Work      │ →  │Break │ →  │   Work      │ →  │Break │ → ...
│ 25 minutes  │    │5 min │    │ 25 minutes  │    │5 min │
└─────────────┘    └──────┘    └─────────────┘    └──────┘
                                                        ↓
                                        After 4 work sessions:
                                        ┌──────────────┐
                                        │  Long Break  │
                                        │  15 minutes  │
                                        └──────────────┘
```

### Benefits

- ✅ **Improved Focus** - Dedicated time blocks reduce distractions
- ✅ **Better Time Management** - Visualize how long tasks actually take
- ✅ **Reduced Mental Fatigue** - Regular breaks prevent burnout
- ✅ **Increased Productivity** - Urgency of timer boosts motivation
- ✅ **Work-Life Balance** - Structured breaks ensure rest

---

## Getting Started

### Step 1: Access the Focus Feature

1. Open the TickTick Clone app
2. Tap the **Focus** tab in the bottom navigation bar
3. You'll see the Focus screen with a circular timer

### Step 2: Select a Task (Optional)

1. Tap the **"Select Task"** button at the top
2. Choose a task from your task list
3. Or select **"No Task"** to focus without a specific task
4. The selected task will appear at the top of the screen

> **Tip:** Selecting a task helps you track which tasks you've focused on and provides better session history.

### Step 3: Start Your First Pomodoro

1. Tap the **"Start Focus"** button
2. The timer will begin counting down from 25 minutes
3. Focus on your task until the timer completes
4. You'll receive a notification when the work session ends

### Step 4: Take a Break

1. When the work session completes, a short break (5 minutes) starts automatically
2. Step away from your work - stretch, walk, or relax
3. You'll receive a notification when the break ends
4. The next work session will start automatically

---

## Using the Focus Feature

### Main Screen Components

```
┌─────────────────────────────────────┐
│  Focus                              │  ← Header
├─────────────────────────────────────┤
│  📋 Complete project proposal       │  ← Selected Task
│     [Change Task]                   │
├─────────────────────────────────────┤
│                                     │
│         ⏱️                          │
│       25:00                         │  ← Timer Display
│     Work Time                       │
│                                     │
├─────────────────────────────────────┤
│  [Start Focus]                      │  ← Controls
│                                     │
├─────────────────────────────────────┤
│  🍅🍅🍅 3 pomodoros today           │  ← Progress
│  Next: Short Break                  │
├─────────────────────────────────────┤
│  Today's Sessions                   │  ← History
│  ✓ 10:30 AM - 25 min - Project     │
│  ✓ 11:00 AM - 25 min - Emails      │
│  ✗ 2:15 PM - 15 min - Meeting      │
│                                     │
│  Total: 65 minutes                  │
└─────────────────────────────────────┘
```

### Timer Controls

**When Idle:**
- **Start Focus** - Begin a new focus session

**When Running:**
- **Pause** - Temporarily pause the timer (max 3 pauses per session)
- **Stop** - End the session early (requires confirmation)

**When Paused:**
- **Resume** - Continue the timer
- **Stop** - End the session early

### Pause Limits

You can pause the timer up to **3 times** per session. This prevents excessive interruptions while allowing flexibility for urgent matters.

```
Pauses Used: 2/3  ← You have 1 pause remaining
```

When you reach the limit, the Pause button will be disabled.

### Quick Start from Task List

You can start a Focus session directly from any task:

1. Go to your task list
2. Find the task you want to focus on
3. Tap the **timer icon (⏱️)** on the right side of the task
4. The Focus screen will open with that task pre-selected
5. Tap "Start Focus" to begin

---

## Customizing Settings

### Accessing Settings

1. Tap the **Settings** tab in the bottom navigation
2. Scroll to the **"Focus"** section
3. Tap **"Pomodoro Configuration"**

### Available Settings

#### Duration Settings

**Work Duration** (5-60 minutes, default: 25)
- How long each work session lasts
- Recommended: 25 minutes (classic Pomodoro)
- Adjust based on your attention span

**Short Break** (1-30 minutes, default: 5)
- Break duration after each work session
- Recommended: 5 minutes
- Use for quick refreshment

**Long Break** (5-60 minutes, default: 15)
- Extended break after multiple pomodoros
- Recommended: 15-30 minutes
- Use for meals or longer rest

#### Pomodoro Settings

**Pomodoros Before Long Break** (2-8, default: 4)
- How many work sessions before a long break
- Classic Pomodoro: 4 sessions
- Adjust based on your stamina

**Maximum Pauses** (0-5, default: 3)
- How many times you can pause per session
- Fewer pauses = more discipline
- More pauses = more flexibility

#### Preferences

**Confirm Stop** (default: ON)
- Show confirmation dialog when stopping early
- Prevents accidental stops
- Turn off if you prefer quick stops

### Restoring Defaults

Tap **"Restore Defaults"** at the bottom of settings to reset all values to their original settings.

---

## Session History

### Viewing Your Sessions

The **Session History** section shows all focus sessions from today:

```
Today's Sessions

✓ 10:30 AM - 25 min - Complete project proposal
  Status: Completed | Pauses: 1

✓ 11:00 AM - 25 min - Review emails
  Status: Completed | Pauses: 0

✗ 2:15 PM - 15 min - Team meeting notes
  Status: Interrupted | Pauses: 2

Total: 65 minutes focused today
```

### Session Status Icons

- **✓ (Green)** - Completed session (reached full duration)
- **✗ (Red)** - Interrupted session (stopped early)

### Understanding Session Data

Each session shows:
- **Time** - When the session started
- **Duration** - How long you focused
- **Task** - What you were working on (if selected)
- **Status** - Completed or Interrupted
- **Pauses** - How many times you paused

### Daily Statistics

At the bottom of the history, you'll see:
- **Total Minutes** - Sum of all session durations today
- **Pomodoros Completed** - Number of full work sessions
- **Sessions** - Total number of sessions (completed + interrupted)

---

## Tips for Success

### Before You Start

1. **Choose Your Task** - Know what you'll work on before starting
2. **Eliminate Distractions** - Close unnecessary apps, silence notifications
3. **Prepare Materials** - Have everything you need within reach
4. **Set Expectations** - Let others know you'll be unavailable

### During a Pomodoro

1. **Stay Focused** - Work on only the selected task
2. **Resist Interruptions** - Note distractions to handle later
3. **Don't Check Time** - Trust the timer, focus on work
4. **Use Pauses Wisely** - Only for urgent matters

### During Breaks

1. **Step Away** - Leave your workspace
2. **Move Your Body** - Stretch, walk, or exercise
3. **Rest Your Eyes** - Look away from screens
4. **Hydrate** - Drink water
5. **Don't Work** - Breaks are for recovery

### General Tips

- **Start Small** - Begin with 2-3 pomodoros per day
- **Track Progress** - Review your session history
- **Adjust Settings** - Find durations that work for you
- **Be Consistent** - Use the technique daily for best results
- **Celebrate Wins** - Acknowledge completed sessions

---

## Troubleshooting

### Timer Issues

**Problem:** Timer doesn't start when I tap "Start Focus"

**Solutions:**
- Check if a session is already running
- Restart the app
- Check for app updates

---

**Problem:** Timer stops when app goes to background

**Explanation:** This is a known limitation of mobile operating systems.

**Solutions:**
- Keep app in foreground during sessions
- Enable notifications to know when timer completes
- Use crash recovery (app will restore session when reopened)

---

**Problem:** Timer is inaccurate (off by several seconds)

**Explanation:** JavaScript timers can drift over time.

**Solutions:**
- Our timer includes drift correction
- Small variations (1-2 seconds) are normal
- Restart timer if drift is significant

---

### Notification Issues

**Problem:** Not receiving notifications when timer completes

**Solutions:**
1. Check notification permissions:
   - iOS: Settings → TickTick Clone → Notifications → Allow
   - Android: Settings → Apps → TickTick Clone → Notifications → Enable
2. Check Do Not Disturb mode is off
3. Restart the app
4. Grant permissions when prompted

---

**Problem:** Notifications are delayed

**Explanation:** OS may delay notifications to save battery.

**Solutions:**
- Keep app in foreground
- Disable battery optimization for the app
- Check notification settings

---

### Session History Issues

**Problem:** Sessions not appearing in history

**Solutions:**
- Complete at least one full session
- Check you're viewing "Today's Sessions"
- Restart the app to reload data

---

**Problem:** Lost session data after app crash

**Explanation:** Data is saved when session completes or stops.

**Solutions:**
- Sessions are auto-saved periodically
- Crash recovery will restore active session
- Completed sessions are always saved

---

### Settings Issues

**Problem:** Settings not saving

**Solutions:**
- Check storage permissions
- Restart the app
- Try "Restore Defaults" then re-apply changes

---

**Problem:** Can't change duration values

**Explanation:** Values have min/max limits for safety.

**Limits:**
- Work Duration: 5-60 minutes
- Short Break: 1-30 minutes
- Long Break: 5-60 minutes
- Pomodoros Before Long Break: 2-8
- Maximum Pauses: 0-5

---

## FAQ

### General Questions

**Q: What is a "Pomodoro"?**

A: A pomodoro is one complete work session (default: 25 minutes). The name comes from the Italian word for "tomato" - Francesco Cirillo used a tomato-shaped kitchen timer.

---

**Q: Can I use the Focus feature without selecting a task?**

A: Yes! Tap "Select Task" and choose "No Task" to focus without linking to a specific task. This is useful for general work or activities not in your task list.

---

**Q: What happens if I close the app during a session?**

A: The timer will stop when the app is backgrounded (OS limitation). When you reopen the app, crash recovery will restore your session if it was active.

---

**Q: Can I change the timer duration mid-session?**

A: No, duration changes only apply to new sessions. This prevents accidentally changing an active session.

---

**Q: Why does the break start automatically?**

A: Auto-starting breaks follows the Pomodoro Technique methodology. It ensures you actually take breaks rather than continuing to work.

---

### Usage Questions

**Q: How many pomodoros should I do per day?**

A: Start with 4-6 pomodoros (2-3 hours of focused work). Experienced users may do 10-12 pomodoros (5-6 hours). Listen to your body and adjust.

---

**Q: What should I do during breaks?**

A: Physical activity is best: walk, stretch, exercise. Also good: hydrate, snack, meditate, or chat with colleagues. Avoid: screens, work, stressful activities.

---

**Q: Can I pause the timer for bathroom breaks?**

A: Yes, but use pauses sparingly (max 3 per session). For longer interruptions, consider stopping the session and starting fresh.

---

**Q: What if I finish my task before the timer ends?**

A: Continue working on related tasks, review your work, or use the time for learning. Don't stop early - the full duration builds focus stamina.

---

**Q: Should I work through breaks if I'm "in the zone"?**

A: No. Breaks are essential for sustained productivity. Working through breaks leads to burnout and reduced effectiveness.

---

### Technical Questions

**Q: Does the Focus feature work offline?**

A: Yes! All data is stored locally on your device. No internet connection required.

---

**Q: Where is my session data stored?**

A: Sessions are stored locally using AsyncStorage on your device. Data is not synced to cloud (yet).

---

**Q: How much storage does session history use?**

A: Very little. Each session is ~200 bytes. You can store thousands of sessions without issues.

---

**Q: Will future updates add cloud sync?**

A: Yes, cloud sync is planned for a future release. Your local data will be preserved.

---

**Q: Can I export my session data?**

A: Not yet, but this feature is planned for a future update.

---

### Customization Questions

**Q: Can I use different durations for different tasks?**

A: Currently, settings apply to all sessions. Custom presets are planned for a future update.

---

**Q: Can I change the notification sound?**

A: Not yet. Custom notification sounds are planned for a future update.

---

**Q: Can I disable auto-start for breaks?**

A: Not currently. Auto-start follows the Pomodoro methodology. Manual control may be added in future.

---

**Q: Why is there a maximum of 5 pauses?**

A: To maintain the integrity of the Pomodoro Technique. Excessive pauses defeat the purpose of focused work.

---

## Need More Help?

### Resources

- **Technical Documentation:** [focus-architecture.md](./focus-architecture.md)
- **Development Roadmap:** [focus-roadmap.md](./focus-roadmap.md)
- **Testing Guide:** [../TESTING_GUIDE.md](../TESTING_GUIDE.md)

### External Resources

- [Pomodoro Technique Official Site](https://francescocirillo.com/pages/pomodoro-technique)
- [Pomodoro Technique Book](https://francescocirillo.com/products/the-pomodoro-technique)

---

## Feedback

We'd love to hear your feedback on the Focus feature! Please share:
- What works well
- What could be improved
- Feature requests
- Bug reports

---

**Happy Focusing! 🍅**

---

**Version:** 1.0.0  
**Last Updated:** January 3, 2026  
**Maintained by:** Development Team
