// create a createSlug function
const createSlug = (inputString) => {
  // Convert the string to lowercase and remove leading/trailing spaces
  const cleanedString = inputString.trim().toLowerCase();

  // Replace spaces and special characters with hyphens
  const slug = cleanedString.replace(/[\s_]+/g, "-");
  // return slug
  return slug;
};

// export createSlug
export default createSlug;
