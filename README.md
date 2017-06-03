# Get started

* Make sure you have node installed
* Download zip, install as theme and activate
* Go to Settings > Hooky and add the following:

| Post Type | Action | Filter | Endpoint | Endpoint Filter | Auth Method | Auth Token | Success Callback |
|-----------|--------|--------|----------|-----------------|-------------|------------|------------------|
| post | CREATE | default | `<inet>`:`3000`/post/new | none | none | --- | none |
| post | UPDATE | default | `<inet>`:`3000`/post/update | none | none | --- | none |

Where `<inet>` is your local network's IP address – hint: use `ifconfig`.

* Run the following commands:

```
cd /path/to/theme/node-app
npm install
node index.js
```

Congrats! You should be good to go.
