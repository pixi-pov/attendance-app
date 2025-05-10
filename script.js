const students = [
    { reg: '22153153014', name: 'Ashish Raj' },
    { reg: '22153153017', name: 'Rahul Kumar' },
    { reg: '22153153018', name: 'Ritu Raj' },
    { reg: '22153153019', name: 'Anish Raj' },
    { reg: '22153153020', name: 'Amit Kumar' },
    { reg: '22153153021', name: 'Rahul Kumar' },
    { reg: '22153153022', name: 'Creyal Srivastava' },
    { reg: '22153153023', name: 'Amarjeet Kumar' }
  ];
  
  // Initialize UI
  document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('studentList');
    
    students.forEach((student, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${student.reg}</td>
        <td>${student.name}</td>
        <td class="status-cell"></td>
      `;
      row.addEventListener('click', () => toggleAttendance(row));
      tbody.appendChild(row);
    });
  
    updateDateTime();
    setInterval(updateDateTime, 1000);
  });
  
  // Toggle attendance status
  function toggleAttendance(row) {
    row.classList.toggle('present');
    updatePresentCount();
  }
  
  // Update date/time display
  function updateDateTime() {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    
    const now = new Date().toLocaleDateString('en-US', options).split(', ');
    document.getElementById('date').textContent = now[1];
    document.getElementById('day').textContent = now[0];
    document.getElementById('time').textContent = now[2];
  }
  
  // Update present counter
  function updatePresentCount() {
    const presentCount = document.querySelectorAll('.present').length;
    document.querySelector('.present-count').textContent = `Present: ${presentCount}`;
  }
  
  // Export to Excel
  function downloadExcel() {
    const data = [["Reg. No", "Student Name", "Status"]];
    document.querySelectorAll('#studentList tr').forEach(row => {
      data.push([
        row.cells[0].textContent,
        row.cells[1].textContent,
        row.classList.contains('present') ? 'Present' : 'Absent'
      ]);
    });
  
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, `Attendance_${new Date().toISOString().slice(0,10)}.xlsx`);
  }
  
  // Show present students modal
  function showPresent() {
    const presentList = document.getElementById('presentList');
    presentList.innerHTML = '';
    
    const presentRows = document.querySelectorAll('.present');
    const presentCount = presentRows.length;
    
    // Add header info
    const heading = document.querySelector('#presentListBox h3');
    heading.innerHTML = `
      <i class="ri-user-star-line"></i>
      Present Students (${presentCount})
      <span class="presence-time">
        <i class="ri-time-line"></i>
        ${new Date().toLocaleTimeString()}
      </span>
    `;
  
    // Add student entries
    presentRows.forEach(row => {
      const reg = row.cells[0].textContent;
      const name = row.cells[1].textContent;
      
      const li = document.createElement('li');
      li.setAttribute('data-reg', reg);
      li.innerHTML = `
        <div class="student-badge">${reg.slice(-2)}</div>
        <div class="student-details">
          <div class="student-name">${name}</div>
          <div class="student-reg">${reg}</div>
        </div>
        <div class="presence-time">
          <i class="ri-checkbox-circle-line"></i>
          ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      `;
      
      // Add click to toggle
      li.addEventListener('click', () => {
        row.classList.toggle('present');
        li.remove();
        updatePresentCount();
      });
      
      presentList.appendChild(li);
    });
  
    document.getElementById('presentListBox').style.display = 'flex';
  }
  // Close modal function
function closeModal() {
    document.getElementById('presentListBox').style.display = 'none';
  }
  
  // Close modal when clicking outside
  document.getElementById('presentListBox').addEventListener('click', (e) => {
    if(e.target === document.getElementById('presentListBox')) {
      closeModal();
    }
  });
  