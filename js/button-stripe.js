(function(){"undefined"==typeof this.CheckoutButton&&(this.CheckoutButton={},CheckoutButton.endPoint="https://www.SnappyCheckout.com/StripeCheckout/Pay",CheckoutButton.resources="https://s3.amazonaws.com/snappycheckout",CheckoutButton.buttons=[]);CheckoutButton.options={};CheckoutButton.load=function(d){if(CheckoutButton.isLoaded)return!1;this.loadScript("js/checkout-stripe.js");CheckoutButton.isLoaded=!0};CheckoutButton.loadButton=function(d){if(null==d)d={};else if("string"==typeof d)for(var b=0;b<CheckoutButton.buttons.length;b++)if(CheckoutButton.buttons[b].id===d){d=CheckoutButton.buttons[b];break}CheckoutButton.options=d;0==this.options.key.length?alert("Error: You must set your Stripe publishable key in your payment button."):(CheckoutButton.stripeCheckoutHandler=StripeCheckout.configure({key:this.options.key,token:function(b,a){void 0==a.billing_name&&(a.billing_name="");void 0==a.billing_address_country&&(a.billing_address_country="");void 0==a.billing_address_zip&&(a.billing_address_zip="");void 0==a.billing_address_state&&(a.billing_address_state="");void 0==a.billing_address_line1&&(a.billing_address_line1="");void 0==a.billing_address_city&&(a.billing_address_city="");void 0==a.shipping_name&&(a.shipping_name="");void 0==a.shipping_address_country&&(a.shipping_address_country="");void 0==a.shipping_address_zip&&(a.shipping_address_zip="");void 0==a.shipping_address_state&&(a.shipping_address_state="");void 0==a.shipping_address_line1&&(a.shipping_address_line1="");void 0==a.shipping_address_city&&(a.shipping_address_city="");CheckoutButton.args=a;CheckoutButton.token=b;CheckoutButton.submitPayment(b.id,b.email)}}),CheckoutButton.stripeCheckoutHandler.open({name:d.name,description:d.description,amount:d.amount.replace(".",""),panelLabel:d.checkoutLabel,currency:d.currency,locale:d.locale,billingAddress:d.billing,shippingAddress:d.shipping,image:d.image,allowRememberMe:d.rememberMe}))};CheckoutButton.submitPayment=function(d,b){this.download(this.endPoint+"?Key="+encodeURIComponent(CheckoutButton.options.key)+"&Token="+d+"&Amount="+CheckoutButton.options.amount+"&Currency="+CheckoutButton.options.currency+"&Name="+encodeURIComponent(CheckoutButton.options.name)+"&Description="+encodeURIComponent(CheckoutButton.options.description)+"&CustomerName="+encodeURIComponent(CheckoutButton.args.billing_name)+"&CustomerEmail="+encodeURIComponent(b)+"&Plan="+encodeURIComponent(CheckoutButton.options.plan)+"&Address1="+encodeURIComponent(CheckoutButton.args.billing_address_line1)+"&City="+encodeURIComponent(CheckoutButton.args.billing_address_city)+"&State="+encodeURIComponent(CheckoutButton.args.billing_address_state)+"&Zip="+encodeURIComponent(CheckoutButton.args.billing_address_zip)+"&Country="+encodeURIComponent(CheckoutButton.args.billing_address_country)+"&ShippingName="+encodeURIComponent(CheckoutButton.args.shipping_name)+"&ShippingAddress1="+encodeURIComponent(CheckoutButton.args.shipping_address_line1)+"&ShippingCity="+encodeURIComponent(CheckoutButton.args.shipping_address_city)+"&ShippingState="+encodeURIComponent(CheckoutButton.args.shipping_address_state)+"&ShippingZip="+encodeURIComponent(CheckoutButton.args.shipping_address_zip)+"&ShippingCountry="+encodeURIComponent(CheckoutButton.args.shipping_address_country))};CheckoutButton.submitPaymentCallback=function(d){null==d&&(d="");0==d.length&&(d="Error: Your purchase could not be completed. An unknown error occurred.");"OK"!=d?alert(d):(0<CheckoutButton.options.message.length&&alert(CheckoutButton.options.message),0<CheckoutButton.options.redirect.length&&(window.location.href=CheckoutButton.options.redirect+(-1<CheckoutButton.options.redirect.indexOf("?")?"&":"?")+"Amount="+CheckoutButton.options.amount+"&Currency="+CheckoutButton.options.currency+"&Name="+encodeURIComponent(CheckoutButton.options.name)+"&Description="+encodeURIComponent(CheckoutButton.options.description)+"&CustomerName="+encodeURIComponent(CheckoutButton.args.billing_name)+"&CustomerEmail="+encodeURIComponent(CheckoutButton.token.email)+"&Plan="+encodeURIComponent(CheckoutButton.options.plan)+"&Address1="+encodeURIComponent(CheckoutButton.args.billing_address_line1)+"&City="+encodeURIComponent(CheckoutButton.args.billing_address_city)+"&State="+encodeURIComponent(CheckoutButton.args.billing_address_state)+"&Zip="+encodeURIComponent(CheckoutButton.args.billing_address_zip)))};CheckoutButton.download=function(d){var b=document.createElement("script");b.src=d;var e=document.getElementsByTagName("head")[0],a=!1;b.onload=b.onreadystatechange=function(){a||this.readyState&&"loaded"!=this.readyState&&"complete"!=this.readyState&&4!=this.readyState||(a=!0,b.onload=b.onreadystatechange=null,e.removeChild(b))};e.appendChild(b)};CheckoutButton.loadScript=function(d){var b;b=document.createElement("script");b.type="text/javascript";b.src=d;d=document.getElementsByTagName("script")[0];d.parentNode.insertBefore(b,d)}}).call(this);(function(){var d,b=[].indexOf||function(a){for(var c=0,b=this.length;c<b;c++)if(c in this&&this[c]===a)return c;return-1},e=[].slice;d=function(a){return a&&(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")};CheckoutButton.Utils={$:function(a){return document.querySelectorAll(a)},$$:function(a){var c,b,d,e,g;if("function"===typeof document.getElementsByClassName)return document.getElementsByClassName(a);if("function"===typeof document.querySelectorAll)return document.querySelectorAll("."+a);c=RegExp("(^|\\s)"+a+"(\\s|$)");e=document.getElementsByTagName("*");g=[];b=0;for(d=e.length;b<d;b++)a=e[b],c.test(a.className)&&g.push(a);return g},attr:function(a,c,b){a.className||(a=document.getElementById(a));return null!=b?a.setAttribute(c,b):a.getAttribute(c)},rattr:function(a,c){a.className||(a=document.getElementById(a));if(a)return a.removeAttribute(c)},hasAttr:function(a,c){var b;a.className||(a=document.getElementById(a));if("function"===typeof a.hasAttribute)return a.hasAttribute(c);b=a.getAttributeNode(c);return!(!b||!b.specified&&!b.nodeValue)},bind:function(a,c,b){return a.addEventListener?a.addEventListener(c,b,!1):a.attachEvent("on"+c,b)},unbind:function(a,c,b){return a.removeEventListener?a.removeEventListener(c,b,!1):a.detachEvent("on"+c,b)},addClass:function(a,c){a.className||(a=document.getElementById(a));a.className&&(a.className+=" "+c)},hasClass:function(a,c){return 0<=b.call(a.className.split(" "),c)},css:function(a,c){return a.style.cssText+=";"+c},insertBefore:function(a,c){return a.parentNode.insertBefore(c,a)},insertAfter:function(a,c){return a.parentNode.insertBefore(c,a.nextSibling)},append:function(a,c){return a.appendChild(c)},remove:function(a){var c;a=document.getElementById(a);return null!=a&&null!=(c=a.parentNode)?c.removeChild(a):void 0},parents:function(a){var c;for(c=[];(a=a.parentNode)&&a!==document&&0>b.call(c,a);)c.push(a);return c},host:function(a){var c;c=document.createElement("div");c.innerHTML='<a href="'+d(a)+'">x</a>';a=c.firstChild;return""+a.protocol+"//"+a.host},resolve:function(a){var c;c=document.createElement("a");c.href=a;return""+c.href},escape:d,text:function(a,c){"innerText"in a?a.innerText=c:a.textContent=c;return c},except:function(){var a,c,d,h,k;d=arguments[0];c=2<=arguments.length?e.call(arguments,1):[];h={};for(a in d)k=d[a],0>b.call(c,a)&&(h[a]=k);return h},hide:function(a){if(a=document.getElementById(a))a.style.display="none"},show:function(a){if(a=document.getElementById(a))a.style.display=""},focusField:function(a){(a=document.getElementById(a))&&a.focus()},getTextBox:function(a){return(a=document.getElementById(a))?a.value:""},getDropdown:function(a){return(a=document.getElementById(a))?a.options[a.selectedIndex].value:""},getDiv:function(a){return(a=document.getElementById(a))?a.innerHTML:""},setDiv:function(a,c){var b=document.getElementById(a);b&&(b.innerHTML=c)},checkEmail:function(a){return/^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/.test(a)?!0:!1},setClass:function(a,c){var b=document.getElementById(a);b&&(b.className=c)}}}).call(this);(function(){var d,b,e,a,c,m,h,k,g,l=function(a,b){return function(){return a.apply(b,arguments)}};g=CheckoutButton.Utils;e=g.bind;k=g.unbind;d=g.append;h=g.text;m=g.parents;c=g.insertAfter;b=g.attr;a=g.hasAttr;CheckoutButton.Button=function(){function f(a){null==a&&(a={});this.setOptions=l(this.setOptions,this);this.parentHead=l(this.parentHead,this);this.parentForm=l(this.parentForm,this);this.open=l(this.open,this);this.submit=l(this.submit,this);this.append=l(this.append,this);this.render=l(this.render,this);this.setOptions(a);this.$el=document.createElement("button");this.$el.setAttribute("type","submit");this.$el.className=this.options.className;this.$el.id=this.options.id;CheckoutButton.buttons.push(this.options);e(this.$el,"click",this.submit);e(this.$el,"touchstart",function(){});this.render()}f.prototype.defaults={id:"",key:"",label:"Buy Now",checkoutlabel:"Pay {{amount}}",currency:"usd",billing:!1,shipping:!1,redirect:"",message:"",locale:"en",plan:"",image:"",rememberMe:!1,visible:!0,cssPath:CheckoutButton.resources+"/button.css",className:"checkout-button-el"};f.prototype.render=function(){this.$el.innerHTML="";this.$el.style.visibility="hidden";this.$span=document.createElement("span");h(this.$span,this.options.label);this.$span.setAttribute("tabindex","0");this.options.nostyle||(this.$span.style.display="block");this.$style=document.createElement("link");this.$style.setAttribute("type","text/css");this.$style.setAttribute("rel","stylesheet");this.$style.setAttribute("href",this.options.cssPath);return d(this.$el,this.$span)};f.prototype.append=function(){var a,b=this;this.options.script&&c(this.options.script,this.$el);this.options.nostyle||(a=this.parentHead())&&d(a,this.$style);if(this.$form=this.parentForm())k(this.$form,"submit",this.submit),e(this.$form,"submit",this.submit);return setTimeout(function(){return b.$el.style.visibility="visible"},1E3)};f.prototype.disable=function(){return b(this.$el,"disabled",!0)};f.prototype.enable=function(){return this.$el.removeAttribute("disabled")};f.prototype.isDisabled=function(){return a(this.$el,"disabled")};f.prototype.submit=function(a){this.open();return!1};f.prototype.open=function(a){CheckoutButton.loadButton(this.options)};f.prototype.renderInput=function(a){var b;b=document.createElement("input");b.type="hidden";b.value=a;return b};f.prototype.parentForm=function(){var a,b,c,d,e;b=m(this.$el);c=0;for(d=b.length;c<d;c++)if(a=b[c],"form"===(null!=(e=a.tagName)?e.toLowerCase():void 0))return a;return null};f.prototype.parentHead=function(){var a,b;return(null!=(a=this.options.document)?a.head:void 0)||(null!=(b=this.options.document)?b.getElementsByTagName("head")[0]:void 0)||this.options.document.body};f.prototype.setOptions=function(a){var b,c,d,e;null==a&&(a={});this.options||(this.options={});if(a.script)for(c in b=this.elementOptions(a.script),b)d=b[c],this.options[c]=d;for(c in a)d=a[c],this.options[c]=d;a=this.defaults;for(c in a)d=a[c],null==(e=this.options)[c]&&(e[c]=d);this.options.amount=this.options.amount.replace(".","").replace(",","").replace("$","")};f.prototype.elementOptions=function(a){return{id:b(a,"id"),key:b(a,"key"),checkoutLabel:b(a,"checkoutlabel"),label:b(a,"label"),name:b(a,"name"),description:b(a,"description"),amount:b(a,"amount"),currency:b(a,"currency"),billing:"true"==b(a,"billing"),shipping:"true"==b(a,"shipping"),redirect:b(a,"redirect"),message:b(a,"message"),locale:b(a,"locale"),plan:b(a,"plan"),image:b(a,"image"),rememberMe:"true"==b(a,"rememberme"),visible:b(a,"visible"),className:b(a,"className"),document:a.ownerDocument,body:a.ownerDocument.body}};return f}()}).call(this);(function(){var d,b,e,a;e=CheckoutButton.Utils;d=e.$$;a=e.hasClass;b=e.addClass;e=e.bind;e(window,"load",function(){return CheckoutButton.load()});(function(){var c;c=d("checkout-button");var e,h,k;k=[];e=0;for(h=c.length;e<h;e++)el=c[e],a(el,"active")||k.push(el);c=k;if(c=c[c.length-1])return b(c,"active"),c=new CheckoutButton.Button({script:c}),!0===c.options.visible&&(c.render(),c.append()),!0})()}).call(this);
