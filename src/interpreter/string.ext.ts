interface String {
  isspace(): boolean;
  isdigit(): boolean;
}

  // This adds definitions to lib.es5.d.ts in node_modules
  // is this what we want?
  String.prototype.isspace = function() {
    return (this.charAt(0) === ' ')
  }

  String.prototype.isdigit = function() {
    return (isNumeric(this.charAt(0)));
  }

  // jQuery - return !isNaN(s - parseFloat(s));
  const isNumeric = (num: string) => {
    return !isNaN(parseInt(num)) 
  }