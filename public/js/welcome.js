document.querySelector(".arrow-down").addEventListener("click", function(event) {
    event.preventDefault();
    const targetSection = document.querySelector("#target");
        
    targetSection.scrollIntoView({
         behavior: "smooth"
    });
});

