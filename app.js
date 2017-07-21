var SimpleRDF = (typeof ld !== 'undefined') ? ld.SimpleRDF : undefined;
var v = {
  "type": { "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", "@type": "@id", "@array": true },

  "ldpcontains": { "@id": "http://www.w3.org/ns/ldp#contains", "@type": "@id", "@array": true },
  "ldpinbox": { "@id": "http://www.w3.org/ns/ldp#inbox", "@type": "@id", "@array": false },
  "ldpResource": { "@id": "http://www.w3.org/ns/ldp#Resource", "@type": "@id", "@array": true  },
  "ldpContainer": { "@id": "http://www.w3.org/ns/ldp#Container", "@type": "@id", "@array": true  },

  "Announce": { "@id": "https://www.w3.org/ns/activitystreams#Announce", "@type": "@id", "@array": true },
  "object": { "@id": "https://www.w3.org/ns/activitystreams#object", "@type": "@id", "@array": false },
  "actor": { "@id": "https://www.w3.org/ns/activitystreams#actor", "@type": "@id", "@array": true },
  "published": { "@id": "https://www.w3.org/ns/activitystreams#published", "@type": "@id", "@array": true }
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
  url = url || window.location.origin + window.location.pathname;
  return getGraph(url, "text/html").then(function(graph){
    var s = graph.child(url);
    return s.ldpinbox;
  });
}

function getSource(notification, proxy){
  // of CORS we need a fudging proxy.
  // TODO: rdf-translator is not a great solution because the API is a bit slow and times
  // out and stuff.
  proxy = proxy || "http://rdf-translator.appspot.com/convert/detect/json-ld/";

  return getGraph(notification).then(function(notifGraph){
    var s = notifGraph.child(notification);
    if(s.type.indexOf(v.Announce["@id"]) >= 0){
      // TODO: this assumes there's only one object in the array, but really 
      // it should add all the results to the same graph as it goes then return 
      // that at the end
      return getGraph(proxy+s.object).then(function(sourceGraph){
        return [s.object, sourceGraph];
      });
    }
  });
}

function getTitle(graph){

}

function getAuthors(graph){
  // eprints
  // eprint -> bibo:authorList -> rdf:_1 etc

  // dokieli
  // -> bibo:authorList / schema:author
}

function getPubType(graph){
  // eprints
  // eprint -> bibo:presentedAt -> dct:title, rdf:type (eg. bibo:Conference)

  // schema (sarven/dokieli)
  // rdf:type (schema:ScholarlyArticle, bibo:Paper), sioc:reply_of -> [some event]
}

function getYear(graph){

}

function renderList(graph, subject){
  var s = graph.child(subject);

  var domList = document.getElementById("listing");

  s.ldpcontains.forEach(function(item){
    getSource(item).then(function(itemGraph){
      domList.appendChild(renderItem(itemGraph[1], itemGraph[0]));
    });
  });
}

function renderItem(graph, subject){
  var s = graph.child(subject);
  console.log(s);
  var li = document.createElement("li");
  li.innerText = subject;
  return li;
}

function init(){
  getInbox().then(function(inbox){
    getGraph(inbox, "application/ld+json").then(function(graph){
      renderList(graph, inbox);
    });
  });

}