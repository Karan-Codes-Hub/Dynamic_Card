import  { useState } from 'react';

/**
 * Custom React Hook to generate random employee data
 * 
 * This hook creates an array of employee objects with realistic data
 * that matches the schema defined in DataItemDescription[]
 * 
 * @param {number} count - Number of employee records to generate (default: 10)
 * @returns {Array} Array of employee objects with consistent data structure
 * 
 * @example
 * // Generate 15 employee records
 * const employees = useEmployeeData(15);
 * 
 * @example
 * // Use default count (10 records)
 * const employees = useEmployeeData();
 */
const useEmployeeData = (count = 10) => {
  /**
   * Generates an array of employee objects with random but realistic data
   * 
   * @param {number} num - Number of employee records to generate
   * @returns {Array} Array of employee objects with properties matching the data schema
   */
  const generateData = (num) => {
    // Predefined arrays for generating realistic data
    const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const departments = ['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'HR'];
    const roles = ['Senior Developer', 'UX Designer', 'Product Manager', 'Frontend Engineer', 'Backend Engineer', 'Team Lead', 'Architect'];
    const statuses = ['active', 'inactive', 'on leave', 'terminated'];
    
    const data = [];
    
    // Generate the requested number of employee records
    for (let i = 1; i <= num; i++) {
      // Randomly select values from the predefined arrays
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const department = departments[Math.floor(Math.random() * departments.length)];
      const role = roles[Math.floor(Math.random() * roles.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Generate a random hire date within the last 5 years
      const hireDate = new Date();
      hireDate.setFullYear(hireDate.getFullYear() - Math.floor(Math.random() * 5));
      hireDate.setMonth(Math.floor(Math.random() * 12));
      hireDate.setDate(Math.floor(Math.random() * 28) + 1);
      
      // Construct the employee object with all required fields
      data.push({
        id: `emp-${1000 + i}`, // Unique ID with prefix
        name: `${firstName} ${lastName}`, // Full name
        role: role, // Job role
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`, // Profile image
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`, // Email based on name
        phone: `+1-${Math.floor(200 + Math.random() * 800)}-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`, // Random phone number
        department: department, // Department assignment
        hireDate: hireDate.toISOString().split('T')[0], // Formatted date (YYYY-MM-DD)
        status: status, // Employment status
        rating: (Math.random() * 5).toFixed(1), // Rating between 0.0 and 5.0
        price: Math.floor(50000 + Math.random() * 150000) // Salary/price between 50K and 200K
      });
    }
    
    return data;
  };
  
  // Use state to store the generated employee data
  // The initial state is set by calling generateData with the specified count
  const [employees] = useState(() => generateData(count));
  
  return employees;
};

export default useEmployeeData;