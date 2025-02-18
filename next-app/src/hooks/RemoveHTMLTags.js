const removeHtmlTags = (description) => {
    if (typeof description !== 'string') {
      return '';
    }
    return description.replace(/<\/?[^>]+(>|$)/g, "");
  };

  export default removeHtmlTags;
  
  // Example usage:
  // const htmlDescription = "<p>This is a <strong>sample</strong> description with <a href='#'>HTML tags</a>.</p>";
  // const cleanDescription = removeHtmlTags(htmlDescription);
  // console.log(cleanDescription); // Output: This is a sample description with HTML tags.
  