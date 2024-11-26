import { getStudents } from "../api/student";

export let studentCodeOptions = [];

export const getAllStudentOption = async (page) => {
  try {
    const limit=20;
    const respone = await getStudents({page,limit});
    studentCodeOptions=respone.data.students.map((student)=>({
      studentCode : student.studentCode,
      name: student.studentCode+'_'+student.name
    }))
     return studentCodeOptions
  } catch (error) {
    console.error("Error fetching banks:", error);
    throw error;
  }
};