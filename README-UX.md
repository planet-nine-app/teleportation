# Teleportation

*Teleportation* is a protocol for transporting entities from one part of cyberspace to another. 
Really anything on the web can be teleported, and any data stored on a server can be teleported, but I use entities to describe users, and the cybespace things they can interact with like shops, games, etc.
Teleportation fits easily into existing web stacks, and is meant to deliver a faster, more nuanced experience to users than the typical website trying to capture all comers.

*Note*: Teleportation can work on any html of a certain type, but an obvious use case is buying things online so that's the use case of this doc. 

## Overview

Resources on the internet are mapped to URIs. 
These URIs let our browsers traverse from one computer to another to whereever that resource is physically located.
Often times the resource at these locations will pull in other resources.
Because *discovery* of these URIs is done almost entirely through search engines, of which 80%+ is Google.
Only 5% of websites get more than ten hits from search a month, and 90% of websites get no hits at all.

From a UX perspective, navigating to a website, entering text, hoping what I want shows up, navigating to a landing page, trying to figure out where to go to get what I want, getting frustrated and heading back to search, putting in something more specific, having the same results come up in a diferent order... well you get the idea.
It's bad.

But not much is made about how anti-consumer *and* anti-business it is. 

Google ads are served through an auction process.
Auctions, by design, allow those with the most money to win the most auctions.
So for any new business to break into the first page of google search results they have to compete with Amazon, Target, and Walmart on spending.

To try and improve this situation, we need to find a way to connect consumers with businesses without the latter spending all their money on advertising.
To do that we need to figure out some better way of sharing URIs. 
And to do that we need to take a look at a shopping experience.

## The search

So I start by typing "black men's socks" into the search bar of DuckDuckGo.
I scroll eight pages (only 0.63% of searchers ever make it to page two) to find a link to a company that isn't a huge national brand. 
Amazingly this brand's name is Black Socks. 
Perfect!
Here's what I'm met with:

![A landing page with lots of clutter, and no black socks.](https://github.com/zach-planet-nine/teleportation/blob/main/black-socks-landing-page.png?raw=true)

Ah, 

## The landing page. 

If anyone who made this page finds their way here let me assure you I'm not trying to dump on your website.
But it is truly a tragedy that this is where we've landed.

One third of the page is a message about how you're going to be tracked in order to advertise to you more.
Nine images of socks, and only one and a half are what I searched for.
And my favorite part, this is a Swiss company (props to them for shipping worldwide). 

Also, everyone can learn a lesson from Black Socks here.
No email login call to action popup, or anything to ensure people bounce right off your site.
Good job Black Socks!

Landing pages are the way they are of course because Google doesn't share with you what people searched to get to your page.
So you have to build a page that captures as many people as possible.
Which is an impossible task because screens are only so big.

## The store

So we've come a long way in the past thirty years of the internet, for better or worse, but we really haven't evolved from the concept of the store.
You open a store, put a bunch of goods in it, and then try to get people to come to your store.
I mean it works right, why change it up?
Well what if we didn't need to change it, but could enhance it?

Here's the black socks selection page:

![Black socks finally found, more things to select.](https://github.com/zach-planet-nine/teleportation/blob/main/black-socks-selection.png?raw=true)

That nice juicy black socks image on the left is represented in html like this:

<div class="product-image-figure-wrapper">
  <figure data-height="1034" data-width="776" class="field field-name-field-product-image field-type-image field-label-hidden">
    <a href="/files/Wadensocken_schwarz.png">
      <img itemprop="image" src="/files/styles/blk_product_large/public/Wadensocken_schwarz.png?itok=KbRvDrxG" alt="Wadensocken Classic in Schwarz">
    </a> 
  </figure>
</div>

That actual page is made up of 6000 lines of HTML and JavaScript, and a couple dozen other scripts to handle tracking, and tagging, and analytics, and blah blah blah.
And now let's all pretend like we live somewhere where our phones are our main gateway to the internet, and unlimited data isn't the norm.

As a consumer, I don't want to have to download all of that junk just to buy some socks. 
What I want are those three tags above with the image of black socks, and maybe a button to buy them.
Why can't I do that?
Why can't I just teleport the socks from the site to my phone?

<teleport id="tlpt:uuid" categories="men black socks">
  <div class="product-image-figure-wrapper">
    <figure data-height="1034" data-width="776" class="field field-name-field-product-image field-type-image field-label-hidden">
      <a href="/files/Wadensocken_schwarz.png">
	<img itemprop="image" src="/files/styles/blk_product_large/public/Wadensocken_schwarz.png?itok=KbRvDrxG" alt="Wadensocken Classic in Schwarz">
      </a> 
    </figure>
  </div>
</teleport>

This is all teleportation adds to your site. 
Two wrapping tags that do nothing to your site whatsoever.
Web crawlers find these tags and propogate them to teleportals. 
Teleportals connect users to this content.

Together with [Sessionless](https://github.com/planet-nine-app/sessionless) and [MAGIC](https://github.com/planet-nine-app/MAGIC), purchases can be made *without* ever travelling to the site. 
