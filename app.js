var SimpleRDF = (typeof ld !== 'undefined') ? ld.SimpleRDF : undefined;
var v = {
  "ldpcontains": { "@id": "http://www.w3.org/ns/ldp#contains", "@type": "@id", "@array": true },
  "ldpResource": { "@id": "http://www.w3.org/ns/ldp#Resource", "@type": "@id", "@array": true  },
  "ldpContainer": { "@id": "http://www.w3.org/ns/ldp#Container", "@type": "@id", "@array": true  }
}

function getResource(url, headers) {
  url = url || window.location.origin + window.location.pathname;
  headers = headers || {};
  if(typeof headers['Accept'] == 'undefined') {
    headers['Accept'] = 'application/ld+json';
  }

  return new Promise(function(resolve, reject) {
    var http = new XMLHttpRequest();
    http.open('GET', url);
    Object.keys(headers).forEach(function(key) {
      http.setRequestHeader(key, headers[key]);
    });
    http.onreadystatechange = function() {
      if (this.readyState == this.DONE) {
        if (this.status === 200) {
          return resolve({xhr: this});
        }
        return reject({status: this.status, xhr: this});
      }
    };
    http.send();
  });
}

function getGraph(url, contentType){
  contentType = contentType || "application/ld+json";
  var headers = {"Accept": contentType}
  return getResource(url, headers).then(function(response){
    var data = response.xhr.response;
    return SimpleRDF.parse(data, contentType, url).then(function(g){
      return SimpleRDF(v, url, g, ld.store);
    });
  });
}

function getInbox(url){
  url = url || window.location.pathname;
  // url = url || window.location.origin + window.location.pathname;
  console.log(url);
  getGraph(url, "text/html").then(function(graph){
    console.log(graph);
  });
}

function renderList(graph, subject){
  var s = graph.child(subject);

  var domList = document.getElementById("listing");

  s.ldpcontains.forEach(function(item){
    domList.appendChild(renderItem(graph, item));
  });
}

function renderItem(graph, subject){
  var li = document.createElement("li");
  li.innerText = subject;
  return li;
}

function init(){
  var inbox = getInbox();
  getGraph(inbox, "application/ld+json").then(function(graph){
    renderList(graph, inbox);
  });
}