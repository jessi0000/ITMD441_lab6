function fetchSunData() {
  const coordinates = locationSelect.value;
  
  if (!coordinates) {
      showError("Please select a location");
      return;
  }
  
  // 显示加载状态
  todayDataGrid.innerHTML = '<div class="data-item"><div class="data-value">Loading...</div></div>';
  tomorrowDataGrid.innerHTML = '<div class="data-item"><div class="data-value">Loading...</div></div>';
  errorMessage.classList.add('hidden');
  
  // 添加console.log调试
  console.log("Fetching data for coordinates:", coordinates);
  
  // 今天的数据
  fetch(`https://api.sunrisesunset.io/json?lat=${coordinates.split(',')[0]}&lng=${coordinates.split(',')[1]}`)
      .then(response => {
          console.log("Today response status:", response.status);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return response.json();
      })
      .then(data => {
          console.log("Today data:", data);
          if (data.status !== 'OK') throw new Error(data.message || 'Unknown error occurred');
          updateDashboard(data.results, todayDataGrid);
          
          // 明天的数据
          return fetch(`https://api.sunrisesunset.io/json?lat=${coordinates.split(',')[0]}&lng=${coordinates.split(',')[1]}&date=tomorrow`);
      })
      .then(response => {
          console.log("Tomorrow response status:", response.status);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return response.json();
      })
      .then(data => {
          console.log("Tomorrow data:", data);
          if (data.status !== 'OK') throw new Error(data.message || 'Unknown error occurred');
          updateDashboard(data.results, tomorrowDataGrid);
      })
      .catch(error => {
          console.error("Error:", error);
          showError(error.message);
      });
}