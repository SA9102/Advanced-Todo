# Change Log

## 23rd September 2025

- Switched from Mantine to MUI as I did not like the interface, plus MUI is much more supported (many changes were required).
- Better user interface (but still to improve), with custom colour scheme.
- Editing a todo no longer switches to a new page, but instead opens a dialog.

## 9th September 2025

- Todos that are saved in local storage can now be optionally transferred to a user's account when logged in.
- Fixed bug where filtering the groups would not work.

## 7th September 2025

- Can create todos while not logged in. These are saved in local storage (but cannot yet be transferred to account if the user then logs in).
- Fixed bug involving a fixed user id.

## 21st August 2025

- Completed validation for registration and login pages, and added error messages.

## 17th August 2025

- Refreshing page no longer logs user out.

## 14th August 2025

- (Finally) added authentication using Express, MongoDB and JWT for permanent note storage.

## (Around 2 months of refactoring code - adding backend + auth and JWT)

## 19th June 2025

- Can edit tags (name and colour). All todos to which the tag is assigned will receive these changes.
- Fixed bug where filtering by tags would not work.

## 17th June 2025

- Can delete tags. They will also be removed from the todos to which they are assigned.

## 15th June 2025

- Can create tags and assign these tags to todos.
- Each tag has a colour, and they appear with the colour assigned to them.
- Re-added the checklist due to bugs when going to the edit page of a todo.

## 4th June 2025

- Refactoring to split off components and improve maintainability.
- Improved design.
- Added light theme.

## 31st May 2025

- Can sort tasks by priority and name.

## 30th May 2025

- Clicking on a todo item marks it as complete/not complete (removed checkbox)

## 29th May 2025 (month later due to university exams)

- Can switch between list and grid layout

## 22nd April 2025

- Todos now have start and end dates and times, which work.
- Will be categoried into 'Pending', 'Upcoming' or 'Overdue'.
- No start means it will be starting immediately.
- No end means it will have no deadline.
- Can now choose to show or hide pending, upcoming, overdue and completed todos.
- Show start and end datetimes when expanded
- Cannot set end datetime before start datetime

## 20th April 2025

- Can filter todos by tags.
- Todo task overflow is hidden if too long.
- Todos now have an end date and time, which is displayed if todo is maximised.

## 19th April 2025

- Can filter todos by text (within task and description) and priority.

## 18th April 2025

- Todo input is fixed at bottom of screen.
- List of todos is scrollable.

## 17th April 2025

- You can assign multiple tags to a todo item.
- If more information than just the task is provided, you can expand a todo item to view more details.

## 16th April 2025

- Each todo item now has a priority of "low", "medium", or "high".
- Todo item has a colour on its left border representing priority.
- Can change the todo task and priority by going to its 'edit page'.

## 13th April 2025

- Repository created and first commit.
- Can create and delete todos.
- Can quickly change todo tasks.
- Divdied todos into 'Pending' and 'Completed'.
- Added progress bar.
