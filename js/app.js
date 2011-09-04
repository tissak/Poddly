var Poddly = SC.Application.create();


Poddly.PodcastModel = SC.Object.extend({
  title: null,
  url: null,
  description: null,
  logo_url: null,
  scaled_logo_url: null,
  url: null,
  website: null,
  subscribers: null
})

Poddly.podcastsController = SC.ArrayProxy.create({
  content: []
});


Poddly.PodcastView = SC.View.extend({
  content: null,
  itemIndexBinding: 'content.itemIndex',
  titleBinding: 'content.title',
  descriptionBinding: 'content.description',
  logoBinding: 'content.logo_url',
  websiteBinding: 'content.website',
  subscribersBinding: 'content.subscribers'
});

Poddly.store = {
  save: function(key,content){
    Lawnchair(function(){
      var ref = {}
      ref[key] = content;
      this.save(ref);
    })
  },

  get: function(key, callback){
    Lawnchair(function(){
        this.get(key, callback);
    })
  }
}

Poddly.fetchContent = function(content, attemptedStore){

  if(attemptedStore == null){
    Poddly.store.get("entries", function(content){
      Poddly.fetchContent(content, true);
      console.log("fetched from cache: ",content);
    });
  }

  if(content != null){
    Poddly.buildFromEntries(content);
    console.log("Built from cache");
    return;
  }

  $.ajax( 'http://gpodder.net/toplist/10.jsonp',{
    dataType:'jsonp',
    jsonp:"jsonp",
    success:function(response){
      Poddly.buildFromEntries(response);
      Poddly.store.save("entries",response);
      console.log("Built from remote");
    },
    error: function(xhr, status) {
      $("<span>Error while loading data: "+status+"</span>").appendTo(document.body);
    }
  });
}

Poddly.buildFromResponse = function(){
  Poddly.buildFromEntries(response);
  Poddly.store.save("entries",response);
  console.log("Built from remote");
}

Poddly.buildFromEntries = function(entries){
  $(entries).each(function(index, item){
    Poddly.podcastsController.pushObject(Poddly.PodcastModel.create(item))
  })
}

// grab the content
$(document).ready(function(){
  Poddly.fetchContent();
});
