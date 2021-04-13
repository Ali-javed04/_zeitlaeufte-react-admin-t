

interface String {
    supplant: (str: string) => any;
    capitalize: () => any;
  }
  
  if (typeof String.prototype.supplant !== 'function') {
    String.prototype.supplant = function (o) {
      return this.replace(/{([^{}]*)}/g,
        function (a, b) {
          var r = o[b];
          return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
      );
    };
  }
  
  if (typeof String.prototype.capitalize !== 'function') {
    String.prototype.capitalize = function () {
      return this.charAt(0).toUpperCase() + this.slice(1);
    }
  }
  
  interface Window {
    isMobileWeb: boolean;
    isIosPlatform: boolean;
    moment: any;
    plugins: any;
  }