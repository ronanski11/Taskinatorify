# Taskinatorify

A feature-rich Chrome extension for managing your daily tasks with deadline tracking and comprehensive history. Built with vanilla JavaScript and modern CSS, this extension offers an intuitive interface for organizing your todos with intelligent deadline management and task tracking. 

# Screenshots

<div style="display: flex; justify-content: space-between;">
    <img src="/images/Active.png" alt="active" width="32%" />
    <img src="/images/Completed.png" alt="completed" width="32%" />
    <img src="/images/History.png" alt="history" width="32%" />
</div>

## Features

- 🎯 Clean, minimal interface with tabbed navigation
- ⏰ Smart deadline management with color-coded urgency
- 📊 Separate views for active and completed tasks
- 📜 Comprehensive task history tracking
- 💾 Persistent storage across browser sessions
- ✨ Smooth animations and transitions
- 📱 Responsive design
- ✅ Custom checkbox styling
- 🗑️ Easy task deletion
- 🎨 Dynamic color scheme based on task urgency
- 🌙 Properly spaced layout
- 📝 Enhanced task input with deadline picker
- 🔄 Real-time updates and filtering

## Task Management Features

### Deadline Tracking
- Color-coded task urgency:
  - 💛 Light Yellow: Due within 72 hours
  - 🟡 Yellow: Due within 48 hours
  - 🟠 Light Orange: Due within 8 hours
  - 🔸 Orange: Due within 5 hours
  - 🔴 Red: Due within 2 hours
  - ❗ Dark Red: Overdue

### Task Organization
- Separate views for:
  - Active tasks
  - Completed tasks
  - Task history
- Multiple sorting options:
  - By deadline
  - By date added
  - By name
  - By completion date (for completed tasks)

### Task Filtering
- Filter tasks by:
  - All tasks
  - Active tasks
  - Upcoming tasks
  - Overdue tasks
- History filtering by:
  - Date
  - Activity type (added, completed, deleted)

## Installation

### From Source
1. Clone this repository:
```bash
git clone https://github.com/ronanski11/Todo-Extension.git
```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" by clicking the toggle in the top-right corner

4. Click "Load unpacked" and select the directory containing the extension files

5. The extension icon should now appear in your Chrome toolbar

## Usage

1. Click the extension icon in your Chrome toolbar to open the todo list
2. Add new tasks:
   - Type your task in the input field
   - Set a deadline using the datetime picker
   - Press Enter or click the "Add" button
3. Manage tasks:
   - Click the checkbox to mark a task as complete
   - Tasks automatically move to the completed tab when checked
   - Use the tabs to switch between active tasks, completed tasks, and history
   - Sort and filter tasks using the dropdown menus
4. Track task history:
   - View all task activities in the history tab
   - Filter history by date or activity type
   - See when tasks were added, completed, or deleted

## Technical Details

### Local Storage
The extension uses Chrome's `storage.local` API to persist todos and history. Data is stored in the following format:

```javascript
{
  todos: [
    {
      id: number,
      text: string,
      completed: boolean,
      dateAdded: string (ISO date),
      deadline: string (ISO date),
      completedDate: string (ISO date) | null
    }
  ],
  history: [
    {
      type: "added" | "completed" | "uncompleted" | "deleted",
      todoId: number,
      text: string,
      date: string (ISO date)
    }
  ]
}
```

### Styling
- Dynamic color-coding based on task urgency
- Tabbed interface for different views
- Custom datetime picker styling
- Enhanced visual feedback for task states
- Smooth transitions between views
- Modern design with clear visual hierarchy

## Development

### Prerequisites
- Google Chrome browser
- Basic knowledge of HTML, CSS, and JavaScript
- Text editor of your choice

### Making Changes
1. Clone the repository 
2. Make your desired changes to the source files
3. Test the extension locally:
   - Navigate to `chrome://extensions/`
   - Click "Load unpacked" if you haven't already
   - Click the refresh icon on your extension card
4. Submit a pull request with your changes

### Code Style Guidelines
- Use consistent indentation (2 spaces)
- Follow JavaScript ES6+ conventions
- Keep functions small and focused
- Comment complex logic
- Use semantic HTML elements
- Follow BEM naming convention for CSS classes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Font Awesome for the beautiful icons
- Chrome Extension documentation
- The open-source community

## Support

If you encounter any issues or have feature requests, please file an issue on the GitHub repository.

## Future Improvement Ideas

- [ ] Dark mode support
- [ ] Task categories/labels
- [ ] Task priority levels
- [ ] Export/import functionality
- [ ] Keyboard shortcuts
- [ ] Task notes/descriptions
- [ ] Multiple todo lists
- [ ] Task search functionality
- [ ] Undo delete action
- [ ] Task reordering
- [ ] Browser sync support
- [ ] Recurring tasks
- [ ] Task sharing capabilities
- [ ] Custom deadline presets
- [ ] Task statistics and analytics

## Author

Ronan Coughlan

##### Disclaimer

This only took me a few hours to complete. This is **not** some huge project of mine.
