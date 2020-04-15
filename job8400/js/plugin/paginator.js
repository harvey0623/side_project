!function(t){"use strict";function e(e,s){s=i(s),this.element=e,this.options=t.extend({},n,s),this._defaults=n,this._name=a,o(this.options),this.setTotalPages=function(t){if(1>t)throw"Total Pages can't be less than 1";this.options.totalPages=t,o(this.options),r(this)},this.changePage=function(t){if(1>t)throw"Page can't be less than 1";if(t>this.options.totalPages)throw"Page is bigger than total pages";this.options.currentPage=t,this.options.pageChange(t),r(this)},this.hide=function(){t(this.element).empty()},this.setPageChangeFn=function(t,e){if("function"!=typeof t)throw"pageChange is not a function";this.options.pageChange=t,this.options.currentPage=e?e:1,this.options.pageChange(this.options.currentPage)},this.init()}var a="simplePaginator",n={totalPages:7,maxButtonsVisible:5,currentPage:1,nextLabel:"next",prevLabel:"prev",firstLabel:"first",lastLabel:"last",clickCurrentPage:!0,pageChange:function(t){console.log(t)}};e.prototype.init=function(){this.options.clickCurrentPage?this.changePage(this.options.currentPage):r(this)};var i=function(t){if(!t.totalPages)throw"totalPages is not defined";if(t.totalPages=s(t.totalPages),!t.pageChange)throw"function pageChange() its not defined";if("function"!=typeof t.pageChange)throw"pageChange is not a function";if(t.maxButtonsVisible&&(t.maxButtonsVisible=s(t.maxButtonsVisible)),t.currentPage&&(t.currentPage=s(t.currentPage)),t.firstLabel&&(t.firstLabel=t.firstLabel.toString()),t.nextLabel&&(t.nextLabel=t.nextLabel.toString()),t.prevLabel&&(t.prevLabel=t.prevLabel.toString()),t.lastLabel&&(t.lastLabel=t.lastLabel.toString()),t.clickCurrentPage&&"boolean"!=typeof t.clickCurrentPage)throw"clickCurrentPage is must be a boolean";return t},s=function(t){if("number"!=typeof t)throw t+" is not a number";if(1>t)throw t+" must be bigger than 0";return Math.floor(t)},o=function(t){t.totalButtons=Math.min(t.totalPages,t.maxButtonsVisible)},r=function(e){var a=e.options;t(e.element).empty();var n='<ul class="pagination">';1===a.currentPage?(n=n.concat('<li class="disabled"><a>',a.firstLabel,"</a></li>"),n=n.concat('<li class="disabled"><a>',a.prevLabel,"</a></li>")):(n=n.concat('<li><a style="cursor:pointer;">',a.firstLabel,"</a></li>"),n=n.concat('<li><a style="cursor:pointer;">',a.prevLabel,"</a></li>"));for(var i=1,s=i+a.totalButtons-1;a.currentPage<i||a.currentPage>s;)a.currentPage>s?(i+=a.totalButtons,s+=a.totalButtons,s>a.totalPages&&(i-=s-a.totalPages,s=a.totalPages)):(i-=a.totalButtons,s-=a.totalButtons,0>i&&(s+=i+a.totalButtons,i=1));a.currentPage===s&&1!=a.totalPages&&(i=a.currentPage-1,s=i+a.totalButtons-1,s>=a.totalPages&&(i-=s-a.totalPages,s=a.totalPages)),i===a.currentPage&&1!=a.totalPages&&1!=a.currentPage&&(s=a.currentPage+1,i=s-(a.totalButtons-1));for(var o=i;s>=o;o++)n=o===a.currentPage?n.concat('<li class="active"><a style="cursor:pointer;">'+o+"</a></li>"):n.concat('<li><a style="cursor:pointer;">'+o+"</a></li>");a.currentPage==a.totalPages?(n=n.concat('<li class="disabled"><a>',a.nextLabel,"</a></li>"),n=n.concat('<li class="disabled"><a>',a.lastLabel,"</a></li>")):(n=n.concat('<li><a style="cursor:pointer;">',a.nextLabel,"</a></li>"),n=n.concat('<li><a style="cursor:pointer;">',a.lastLabel,"</a></li>")),n=n.concat("</ul>"),t(e.element).append(n),t(e.element).find("ul li").not(".disabled").not(".active").click(function(){var n,i=t(this).find("a").text();switch(i){case a.firstLabel:n=1;break;case a.prevLabel:n=a.currentPage-1;break;case a.nextLabel:n=a.currentPage+1;break;case a.lastLabel:n=a.totalPages;break;default:n=parseInt(i)}e.changePage(n)})};t.fn[a]=function(n){var i=t.makeArray(arguments),s=i.slice(1);return this.each(function(){var i=t.data(this,"plugin_"+a);if(!i){var o=new e(this,n);return t.data(this,"plugin_"+a,o),o}if(!i[n])throw"Method "+n+"doesn't exists";i[n].apply(i,s)})}}(jQuery,window,document);