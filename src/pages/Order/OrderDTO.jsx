class OrderDTO {
    constructor(
      companyAddress, 
      companyName, 
      departureDate, 
      dominantHand, 
      eduRequirements, 
      experience, 
      interviewDate, 
      interviewStatus, 
      jobDescription, 
      gender, 
      age, 
      maxAge, 
      minAge, 
      female, 
      male, 
      notes, 
      orderCode, 
      orderName, 
      quality, 
      salary, 
      unionName,
      vision,
      maritalStatus,
      visaTypes,
      physicalStrength,
      interviewFormat,
      insurance,
    ) {
      this.companyAddress = companyAddress;
      this.companyName = companyName;
      this.departureDate = departureDate;
      this.dominantHand = dominantHand;
      this.eduRequirements = eduRequirements;
      this.experience = experience;
      this.interviewDate = interviewDate;
      this.interviewStatus = interviewStatus;
      this.jobDescription = jobDescription;
      this.gender = gender; 
      this.age = age; 
      this.maxAge = maxAge; 
      this.minAge = minAge; 
      this.female = female; 
      this.male = male; 
      this.notes = notes;
      this.orderCode = orderCode;
      this.orderName = orderName;
      this.quality = quality;
      this.salary = salary;
      this.unionName = unionName;
      this.vision=vision;
      this.maritalStatus=maritalStatus;
      this.visaTypes=visaTypes;
      this.physicalStrength=physicalStrength;
      this.interviewFormat=interviewFormat;
      this.insurance=insurance;
    }
  
    // This method returns the age range as a string (e.g., "30-40")
    setAge() {
      return `${this.minAge}-${this.maxAge}`;
    }
  
    // This method returns gender as a concatenated string (e.g., "male_female")
    setGender() {
      return `${this.male} Nam -${this.female} Nữ`;
    }
  }
  export default OrderDTO