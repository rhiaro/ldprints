# ldprints

Imagine if eprints was powered only by [LDN](https://www.w3.org/TR/ldn).

## What does eprints do?

* Archives copies of academic articles and their metadata.
* Sorts these articles by criteria like year or department for easy browsing.
* Provides search over the article metadata.
* Provides statistics about the articles.
* Provides an interface for academics and administrators to add articles and metadata to the respository (I think?).
* ...?

Individual institutions typically install and maintain their own copy of the eprints code, and fill it with articles by their own employees and affiliates.

## What is LDN?

Linked Data Notifications is a protocol that lets clients or servers propel messages to other people or systems by first discovering where their target wants notifications sent to (the Inbox), constructing a payload of useful information in RDF, and sending it with an HTTP `POST` request. These messages are stored by the recipient and exposed for reuse by other applications.

LDN enables *decentralised* notifications. That means clients and servers are completely decoupled. This means you can use two different applications made by people who are not aware of each other, and yet they can both do something useful for you with the notifications in your Inbox.

## Why should we decentralise eprints?

* Give academics more control over their work. Give them the opportunity to store canonical copies of publications and metadata in their own space.
* Open more ways of archiving and listing academic publications (rather than a single UI which is tightly coupled to a database).
* Modularise archival software so other software from the scholarly publication ecosystem can be plugged in (because everyone likes to use different things for different parts of the process).

## How do we do eprint things with LDN?

1. I have finished a (version of a) article and I want my institution to archive this for me.
2. My article-editing software, or some other perhaps totally independent notification sending tool, sends a ping to my institution's ldprints, pointing at my article.
3. ldprints retrieves my article, parses all the metadata it can find (which I helpfully included in RDFa or whatever), and also takes a full copy of the article and stores it, and adds it to its index.
4. My article is now listed for people to discover.

## TODO 

Move these to issues.

### Decentralisation-y

* Demonstrate decoupledness/modularness by adding an 'archive' button to [dokieli](https://dokie.li) which sends the notification requesting the archival.
* Actually make the copy from the notification, rather than just dynamically pulling data in from notifications.
* Make a great portability experience academics who move from one institution to another. Perhaps the person lists their previous institutions eprints their new eprints archive can automatically fetch earlier publications, etc.
* Handle notifications which are updates and deletes.
* Authentication etc... maybe signing notifications... other people shouldn't be able to update metadata about my articles (unless I say they can).

### Orthogonal

* Good search indexing and sorting and stuff.
* ... all the other things current eprints does.