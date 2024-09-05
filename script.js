document.addEventListener("DOMContentLoaded", function() {
    let lists = document.getElementsByClassName("team");
    let rightBox = document.getElementById("right");
    let leftBox = document.getElementById("left");
    let dropdownBtns = document.getElementsByClassName("dropdown-btn");


    function closeAllDropdowns() {
        let dropdownContents = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdownContents.length; i++) {
            dropdownContents[i].style.display = "none";
        }
    }

    // Dropdown lists are closed first
    closeAllDropdowns();

    for (let team of lists) {
        team.addEventListener("dragstart", function(e) {
            let selected = e.target;

            rightBox.addEventListener("dragover", function(e) {
                e.preventDefault();
            });
            rightBox.addEventListener("drop", function(e) {
                if (rightBox.children.length === 0) {
                    rightBox.appendChild(selected);
                    selected = null;

                    rightBox.removeEventListener("dragover", dragOver);
                    rightBox.removeEventListener("drop", drop);
                }
            });

            leftBox.addEventListener("dragover", function(e) {
                e.preventDefault();
            });
            leftBox.addEventListener("drop", function(e) {
                if (leftBox.children.length === 0) {
                    leftBox.appendChild(selected);
                    selected = null;

                    leftBox.removeEventListener("dragover", dragOver);
                    leftBox.removeEventListener("drop", drop);
                }
            });
        });
    }

    leftBox.addEventListener("dblclick", function(e) {
        let item = e.target;
        if (item.classList.contains("team")) {
            item.parentNode.removeChild(item); 
            document.querySelector(".pick").appendChild(item); 
        }
    });

    rightBox.addEventListener("dblclick", function(e) {
        let item = e.target;
        if (item.classList.contains("team")) {
            item.parentNode.removeChild(item); 
            document.querySelector(".pick").appendChild(item); 
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    let dropdownBtns = document.getElementsByClassName("dropdown-btn");

    function closeAllDropdowns() {
        let dropdownContents = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdownContents.length; i++) {
            dropdownContents[i].style.display = "none";
        }
    }

    // Dropdown lists are closed first
    closeAllDropdowns();

    // Event Listener that reacts to click on interactive objects (ex: buttons...)
    for (let i = 0; i < dropdownBtns.length; i++) {
        dropdownBtns[i].addEventListener("click", function(e) {
            e.stopPropagation();
            
            let dropdownContent = this.nextElementSibling;
            while (dropdownContent && !dropdownContent.classList.contains("dropdown-content")) {
                dropdownContent = dropdownContent.nextElementSibling;
            }

            if (dropdownContent) {
                

                // Closes an open dropdown 
                if (dropdownContent.style.display === "block") {
                    dropdownContent.style.display = "none";
                } else {
                    // Closes all dropdown lists when opening one to avoid filling up screen
                    closeAllDropdowns();
                    dropdownContent.style.display = "block";
                }
            }
        });
    }
});