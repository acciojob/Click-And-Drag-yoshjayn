// Your code here.
    // Select all cubes
    const cubes = document.querySelectorAll(".item");
    let isDragging = false;
    let currentCube = null;
    let offsetX, offsetY;

    // Add event listeners to each cube
    cubes.forEach(cube => {
      cube.addEventListener("mousedown", (e) => {
        isDragging = true;
        currentCube = e.target;
        currentCube.classList.add("active");

        // Calculate the offset between mouse click and cube's top-left corner
        const rect = currentCube.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        // Add event listeners for mousemove and mouseup
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      });
    });

    // Handle mouse movement
    function onMouseMove(e) {
      if (isDragging && currentCube) {
        // Calculate new position
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        // Apply boundary constraints
        const container = document.querySelector(".items");
        const containerRect = container.getBoundingClientRect();
        const cubeRect = currentCube.getBoundingClientRect();

        newX = Math.max(containerRect.left, Math.min(newX, containerRect.right - cubeRect.width));
        newY = Math.max(containerRect.top, Math.min(newY, containerRect.bottom - cubeRect.height));

        // Update cube position
        currentCube.style.left = `${newX - containerRect.left}px`;
        currentCube.style.top = `${newY - containerRect.top}px`;
      }
    }

    // Handle mouse release
    function onMouseUp(e) {
      if (isDragging && currentCube) {
        isDragging = false;
        currentCube.classList.remove("active");

        // Find the cube at the drop position
        const dropCube = document.elementFromPoint(e.clientX, e.clientY);

        // Swap positions and colors if the drop target is another cube
        if (dropCube && dropCube.classList.contains("item") && dropCube !== currentCube) {
          // Swap positions in the DOM
          const temp = document.createElement("div");
          currentCube.parentNode.insertBefore(temp, currentCube);
          dropCube.parentNode.insertBefore(currentCube, dropCube);
          temp.parentNode.insertBefore(dropCube, temp);
          temp.remove();

          // Swap classes responsible for colors
          const movingCubeClasses = Array.from(currentCube.classList).filter(cls => cls.startsWith("item"));
          const dropCubeClasses = Array.from(dropCube.classList).filter(cls => cls.startsWith("item"));

          // Remove existing color classes
          currentCube.classList.remove(...movingCubeClasses);
          dropCube.classList.remove(...dropCubeClasses);

          // Add swapped color classes
          currentCube.classList.add(...dropCubeClasses);
          dropCube.classList.add(...movingCubeClasses);
        }

        // Reset the dragged cube's position
        currentCube.style.left = "0";
        currentCube.style.top = "0";
        currentCube = null;

        // Remove event listeners
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      }
    }