/**
 * 首页VIEW
 */
var thumbnailPages = 3;//假设有三页

function HomeView(){
	var thumbnailView = new ThumbnailView();
	this.initHomeView = function(){
		thumbnailView.initpaginationView();
	};
}