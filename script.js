document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });

    // Sample plant data (in a real app, this would come from plants.json)
    const plants = [
        {
            id: 1,
            name: "Tomato",
            image: "assets/images/plants/tomato.png",
            type: "vegetable",
            sun: "Full sun",
            water: "Regular watering",
            spacing: "24-36 inches",
            description: "Tomatoes are warm-season vegetables that thrive in full sun and fertile, well-drained soil. They come in many varieties from small cherry tomatoes to large beefsteak types.",
            companions: ["Basil", "Carrots", "Onions"],
            avoid: ["Cabbage", "Potatoes"],
            season: ["spring", "summer"]
        },
        {
            id: 2,
            name: "Basil",
            image: "assets/images/plants/basil.png",
            type: "herb",
            sun: "Full sun to partial shade",
            water: "Regular watering",
            spacing: "12-18 inches",
            description: "Basil is a fragrant herb that's easy to grow and essential for many cuisines. It prefers warm temperatures and moist, well-drained soil.",
            companions: ["Tomatoes", "Peppers", "Oregano"],
            avoid: ["Rue", "Sage"],
            season: ["spring", "summer"]
        },
        // Add more plants as needed
    ];

    // Initialize garden grid
    const gardenGrid = document.getElementById('garden-grid');
    const gridSize = 10; // 10x10 grid
    const gridCells = [];
    
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.index = i;
        gardenGrid.appendChild(cell);
        gridCells.push(cell);
    }

    // Load plants into toolbar
    const plantToolbar = document.getElementById('plant-toolbar');
    plants.forEach(plant => {
        const plantItem = document.createElement('div');
        plantItem.className = 'plant-item bg-white p-2 rounded border border-green-300 hover:shadow-md flex flex-col items-center';
        plantItem.dataset.plantId = plant.id;
        plantItem.draggable = true;
        
        const plantImg = document.createElement('img');
        plantImg.src = plant.image;
        plantImg.alt = plant.name;
        plantImg.className = 'w-12 h-12 object-contain mb-1';
        
        const plantName = document.createElement('span');
        plantName.className = 'text-sm text-center';
        plantName.textContent = plant.name;
        
        plantItem.appendChild(plantImg);
        plantItem.appendChild(plantName);
        plantToolbar.appendChild(plantItem);

        // Add drag events
        plantItem.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', plant.id);
            this.classList.add('dragging');
        });

        plantItem.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
    });

    // Add drop events to grid cells
    gridCells.forEach(cell => {
        cell.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.backgroundColor = '#bbf7d0';
        });

        cell.addEventListener('dragleave', function() {
            this.style.backgroundColor = '#f0fdf4';
        });

        cell.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.backgroundColor = '#f0fdf4';
            
            const plantId = e.dataTransfer.getData('text/plain');
            const plant = plants.find(p => p.id == plantId);
            
            if (plant) {
                // Clear any existing plant in this cell
                this.innerHTML = '';
                
                const plantElement = document.createElement('div');
                plantElement.className = 'plant-in-garden';
                plantElement.dataset.plantId = plant.id;
                
                const plantImg = document.createElement('img');
                plantImg.src = plant.image;
                plantImg.alt = plant.name;
                plantImg.className = 'plant-img';
                
                plantElement.appendChild(plantImg);
                this.appendChild(plantElement);
                
                // Add click event to show plant info
                plantElement.addEventListener('click', function(e) {
                    e.stopPropagation();
                    showPlantInfo(plant);
                });
            }
        });

        cell.addEventListener('click', function() {
            // Clear the cell on click
            this.innerHTML = '';
        });
    });

    // Plant library
    const plantLibraryGrid = document.getElementById('plant-library-grid');
    plants.forEach(plant => {
        const plantCard = document.createElement('div');
        plantCard.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow';
        
        plantCard.innerHTML = `
            <div class="h-48 bg-green-100 flex items-center justify-center p-4">
                <img src="${plant.image}" alt="${plant.name}" class="h-full object-contain">
            </div>
            <div class="p-4">
                <h3 class="font-bold text-lg mb-2">${plant.name}</h3>
                <div class="flex justify-between text-sm text-gray-600 mb-3">
                    <span><i class="fas fa-sun mr-1"></i> ${plant.sun}</span>
                    <span><i class="fas fa-tint mr-1"></i> ${plant.water}</span>
                </div>
                <button class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 view-plant-btn" data-plant-id="${plant.id}">
                    View Details
                </button>
            </div>
        `;
        
        plantLibraryGrid.appendChild(plantCard);
    });

    // Plant search
    const plantSearch = document.getElementById('plant-search');
    plantSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const plantCards = plantLibraryGrid.querySelectorAll('.bg-white');
        
        plantCards.forEach(card => {
            const plantName = card.querySelector('h3').textContent.toLowerCase();
            if (plantName.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // View plant buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-plant-btn')) {
            const plantId = e.target.dataset.plantId;
            const plant = plants.find(p => p.id == plantId);
            if (plant) {
                showPlantInfo(plant);
            }
        }
    });

    // Modal functionality
    const plantInfoModal = document.getElementById('plant-info-modal');
    const closeModal = document.getElementById('close-modal');
    const addToGarden = document.getElementById('add-to-garden');
    let currentPlant = null;

    function showPlantInfo(plant) {
        currentPlant = plant;
        
        document.getElementById('modal-plant-name').textContent = plant.name;
        document.getElementById('modal-plant-image').src = plant.image;
        document.getElementById('modal-plant-desc').textContent = plant.description;
        document.getElementById('modal-plant-sun').textContent = plant.sun;
        document.getElementById('modal-plant-water').textContent = plant.water;
        document.getElementById('modal-plant-soil').textContent = "Well-drained, fertile";
        document.getElementById('modal-plant-spacing').textContent = plant.spacing;
        document.getElementById('modal-plant-companions').textContent = plant.companions.join(', ');
        
        plantInfoModal.classList.remove('hidden');
    }

    closeModal.addEventListener('click', function() {
        plantInfoModal.classList.add('hidden');
    });

    addToGarden.addEventListener('click', function() {
        if (currentPlant) {
            // In a real app, we would add the plant to the garden
            alert(`${currentPlant.name} is ready to be added to your garden! Drag it from the toolbar.`);
            plantInfoModal.classList.add('hidden');
        }
    });

    // Close modal when clicking outside
    plantInfoModal.addEventListener('click', function(e) {
        if (e.target === plantInfoModal) {
            plantInfoModal.classList.add('hidden');
        }
    });

    // Save garden button
    document.getElementById('save-btn').addEventListener('click', function() {
        const gardenName = document.getElementById('garden-name').value || "My Garden";
        alert(`${gardenName} saved successfully!`);
    });

    // Clear garden button
    document.getElementById('clear-btn').addEventListener('click', function() {
        if (confirm("Are you sure you want to clear your garden?")) {
            gridCells.forEach(cell => {
                cell.innerHTML = '';
            });
        }
    });

    // Grid size button (placeholder functionality)
    document.getElementById('grid-size-btn').addEventListener('click', function() {
        alert("In the full version, you could change grid size here!");
    });

    // Season select change
    document.getElementById('season-select').addEventListener('change', function() {
        const season = this.value;
        alert(`Showing plants suitable for ${season}. In the full version, this would filter plants.`);
    });
});