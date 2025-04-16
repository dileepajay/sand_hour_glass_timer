 

# Sand Hour Glass Timer

A **2D Hourglass Timer** built with HTML5 Canvas, JavaScript, and Tailwind CSS. This interactive timer displays an animated hourglass that depletes over time, with options to select preset or custom durations. It’s designed for a clean, modern UI and a simple, mobile-friendly layout.

![Screenshot of the Sand Hour Glass Timer](images/Screenshot%202025-04-16%20155303.png)

## Features

- **Animated Hourglass**: Displays top and bottom sand areas that fill/deplete over time.
- **Preset Times**: Quickly select common durations (1 min, 5 min, 10 min, etc.).
- **Custom Time (Optional)**: Prompt the user with a small modal to input hours/minutes.
- **Canvas Rendering**: Uses plain HTML5 Canvas for drawing and animation.
- **Responsive**: Works well on mobile devices and scales to different screen sizes.
- **Dark Mode Toggle** (optional): Built-in if you choose to enable it.
- **Clean UI**: Utilizes Tailwind CSS and a minimal design.

## Repository

- **Repo Name**: sand_hour_glass_timer  
- **GitHub URL**: [https://github.com/dileepajay/sand_hour_glass_timer.git](https://github.com/dileepajay/sand_hour_glass_timer.git)

## Getting Started

1. **Clone the Repo**  
   ```bash
   git clone https://github.com/dileepajay/sand_hour_glass_timer.git
   cd sand_hour_glass_timer
   ```

2. **Open `index.html` in Your Browser**  
   - The timer and canvas will load immediately.  
   - All dependencies (Tailwind, GSAP) are loaded via CDN.

3. **Usage**  
   - **Select a Preset** from the dropdown or choose **Add Custom Time** (if enabled) to specify a unique duration.  
   - **Start** the timer to see the sand flow animation.  
   - **Pause** to halt the countdown.  
   - **Reset** to flip the hourglass and restore the initial state.

## File Structure

```
sand_hour_glass_timer/
│
├─ index.html         # Main HTML structure
├─ style.css          # Tailwind classes and custom overrides
├─ app.js             # Hourglass drawing & timer logic
├─ README.md          # Project documentation
└─ images/
    └─ Screenshot 2025-04-16 155303.png
```

## Customization

1. **Hourglass Dimensions**  
   - The code can automatically adjust the hourglass size relative to the canvas dimensions.  
   - You can tweak scaling ratios in `app.js`.

2. **Presets**  
   - Add or remove preset times in the `<select>` element (`presetSelect`).

3. **Add Custom Time**  
   - If implemented, a small modal allows specifying hours & minutes.  
   - On confirmation, a new option is appended to the dropdown.

4. **Dark Mode**  
   - If you included a toggle, it simply toggles the `.dark` class on the `<html>` element.  
   - Customize color schemes in `style.css` or Tailwind config.

## Contributing

1. **Fork** the repository.  
2. **Create** a feature branch: `git checkout -b my-new-feature`.  
3. **Commit** your changes: `git commit -m "Add some feature"`.  
4. **Push** to the branch: `git push origin my-new-feature`.  
5. **Create** a pull request in GitHub.

## License

[MIT License](LICENSE) (or whichever license you prefer).  

---

 

Enjoy using the **Sand Hour Glass Timer**! If you have any issues or suggestions, please open an [issue](https://github.com/dileepajay/sand_hour_glass_timer/issues) or submit a pull request.