function displayUsersInTable() {
  // Check if the page has a table
  const userTable = document.getElementById("userTable");
  if (!userTable) return;

  const tbody = userTable.querySelector("tbody");
  if (!tbody) return;

  // Clear the existing table data
  tbody.innerHTML = "";

  // Fetching users array from html local storage
  const users = JSON.parse(localStorage.getItem("users")) || [];
  users.sort((a, b) => b.score - a.score);

  // If array is empty display appropriate error message
  if (users.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = '<td class="bg-info" colspan="3" style="text-align:center;">No users in the leaderboard.</td>';
    tbody.appendChild(row);
    return;
  }

  // Creating table, appending images
  users.slice(0,5).forEach((user, index) => {
    
    const row = document.createElement("tr");
    const colorClass = index % 2 === 0 ? "bg-primary" : "bg-info";

    let id = "";
    let medalImage = "award.png";
    if (index === 0) {
      medalImage = "gold.png";
    } else if (index === 1) {
      medalImage = "silver.png";
      id="silver";
    } else if (index === 2) {
      medalImage = "bronze.png";
    } else {
      id = "award"
    }

    row.innerHTML = `
      <td class="${colorClass}">${index + 1}
        <img class="medal" src="../images/${medalImage}" id="${id}" />
      </td>
      <td class="${colorClass}">
        <img class="avatar" src="../images/avatar.png" alt="" />
        ${user.firstName}
      </td>
      <td class="${colorClass}">
        <img class="star" src="../images/star.png" alt="" />
        ${user.score}
      </td>
    `;
    tbody.appendChild(row);
  });
}


// Call the function to display users in the table
displayUsersInTable();
