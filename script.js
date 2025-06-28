const localData = localStorage.getItem('data');
let extensionsData = localData ? JSON.parse(localData) : [];

const fetchData = function() {
    return fetch('data.json') // Changed path (no ./)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('data', JSON.stringify(data));
            extensionsData = data;
            initializeUI(); // Initialize UI after data is loaded
        })
        .catch(error => {
            console.error('Error:', error);
            // Load UI even if fetch fails (using existing localStorage data if any)
            initializeUI();
        });
};



// Initialize UI after data is loaded
const initializeUI = function() {
    const activeStatus = localStorage.getItem('activeStatus') || 'allData';
    
    if (activeStatus === 'allData') {
        loadAllData();
    } else if (activeStatus === 'active') {
        loadActiveData();
    } else {
        loadInActiveData();
    }
};

//////////////// DOM ////////////
const theme = document.getElementById('extension_theme_toggler')
const extension_list = document.getElementById('extension_list')
const all_btn = document.getElementById('all_btn')
const active_btn = document.getElementById('active_btn')
const inactive_btn = document.getElementById('Inactive_btn')
const body = document.querySelector('body')
let lightMode = localStorage.getItem('lightMode')
let activeStatus = localStorage.getItem('activeStatus')





const enableLightMode = () =>{
  body.classList.add('light')
  localStorage.setItem('lightMode', 'active')
}

const disableLightMode = ()=> {
  body.classList.remove('light')
  localStorage.setItem('lightMode', null)
}

if(lightMode === 'active'){
  enableLightMode()
}


function toggleTheme() {
lightMode = localStorage.getItem('lightMode')

lightMode = lightMode !== 'active'?enableLightMode():disableLightMode()
 
}



const activate = function(extensionName) {
    // Find the extension in the array
    const extensionIndex = extensionsData.findIndex(ext => ext.name.trim().toLowerCase() === extensionName.trim().toLowerCase());
    console.log(extensionIndex)
    if (extensionIndex !== -1) {
        // Toggle the isActive status
        extensionsData[extensionIndex].isActive = !extensionsData[extensionIndex].isActive;
        // Reload the current view
        localStorage.setItem('data', JSON.stringify(extensionsData))
        if (all_btn.classList.contains('active')) {
            loadAllData();
        } else if (active_btn.classList.contains('active')) {
            loadActiveData();
        } else {
            loadInActiveData();
        }
    }
}

const deleteItem = (itemName)=>{
  const currentIndex = extensionsData.findIndex((currItem) => {
    return currItem.name.trim().toLowerCase() === itemName.trim().toLowerCase()
})
  extensionsData.splice(currentIndex, 1)
   localStorage.setItem('data', JSON.stringify(extensionsData))
   initializeUI()
  
}

const loadAllData = function(){
    all_btn.classList.add('active');
    active_btn.classList.remove('active');
    inactive_btn.classList.remove('active');
    localStorage.setItem('activeStatus', 'allData')
    loadData(extensionsData)
}

const loadActiveData = function(){
    all_btn.classList.remove('active');
    active_btn.classList.add('active');
    inactive_btn.classList.remove('active');
    localStorage.setItem('activeStatus', 'active')

    const activeExtension = extensionsData.filter(extension => {
        return extension.isActive
    })  
    
    loadData(activeExtension)
    
}

const loadInActiveData = function(){
    all_btn.classList.remove('active');
    active_btn.classList.remove('active');
    inactive_btn.classList.add('active');
    localStorage.setItem('activeStatus', 'inActive')
    
    const inActiveData = extensionsData.filter(extension => {
        return !extension.isActive
      })


    loadData(inActiveData)
}

const loadData = function(dataToRender){
    extension_list.innerHTML = ''

    dataToRender.forEach(extension => {
        const activeClass = extension.isActive ? 'extension_item_active': 'extension_item_inActive';
        const extension_item = document.createElement('li')
        extension_item.className = 'extension_item'
        extension_item.innerHTML = `
        <div class="extension_item_info">
          <div class="extension_item_logo">
            <img src="${extension.logo}" alt="" sizes="" srcset="">
          </div>
          <div class="extension_item_details">
            <h3>${extension.name}</h3>
            <p>${extension.description}</p>
          </div>
        </div>
        <div class="extension_item_action">
          <button class="extension_item_remove" onclick="deleteItem('${extension.name}')">Remove</button>
          <div class="${activeClass}" onclick="activate('${extension.name}')">
            <div class="activate_inner"></div>
          </div>
        </div>
        `
        extension_list.appendChild(extension_item)



       

    });
      
}


if(activeStatus === 'allData'){
  all_btn.classList.add('active')
  loadData(extensionsData)
}else if(activeStatus === 'active'){
  loadActiveData()
}else if (activeStatus === 'inActive'){
  loadInActiveData()
}


theme.addEventListener('click', toggleTheme)
all_btn.addEventListener('click', loadAllData)
active_btn.addEventListener('click', loadActiveData)
inactive_btn.addEventListener('click', loadInActiveData)

function initApp() {
    if (!extensionsData || extensionsData.length === 0) {
        fetchData(); // Fetch if no data exists
    } else {
        initializeUI(); // Use existing data
    }
}

document.addEventListener('DOMContentLoaded', initApp);




