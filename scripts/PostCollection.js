class PostCollection {
  constructor(posts) {
    this._posts = posts;
  }

  getPage(start = 0, count = 10, filter = {}) {
    const posts = this._posts.filter((post) => {
      if (parseInt(post.id, 10) <= start) {
        return false;
      }

      if (filter.author) {
        if (post.author !== filter.author) {
          return false;
        }
      }

      if (filter.createdAt) {
        const current = filter.createdAt;
        current.setHours(0, 0, 0, 0);

        const next = new Date();
        next.setDate(current.getDate() + 1);
        next.setHours(0, 0, 0, 0);

        if (current > post.createdAt || post.createdAt > next) {
          return false;
        }
      }

      if (filter.hashTags && filter.hashTags.length) {
        return post.hashTags.some(tag => filter.hashTags.includes(tag));
      }
      return true;
    });

    posts.sort((x, y) => x.createdAt.getTime() > y.createdAt.getTime());

    return posts.splice(0, count);
  }

  get(id) {
    return this._posts.find(post => post.id === id);
  }

  add(post) {
    if (!PostCollection.validate(post)) {
      return false;
    }
    this._posts.push(post);
    return true;
  }

  addAll(posts) {
    const notValidated = [];
    posts.forEach((post) => {
      if (PostCollection.validate(post)) {
        this.add(post);
      } else {
        notValidated.push(post);
      }
    });

    return notValidated;
  }

  edit(id, post) {
    const index = this._posts.findIndex(p => p.id === id);
    if (index === -1) {
      return false;
    }

    const postCopy = {};
    Object.getOwnPropertyNames(this._posts[index]).forEach((prop) => {
      postCopy[prop] = this._posts[index][prop];
    });

    const {
      description,
      photoLink,
      hashTags,
    } = post;

    if (description) {
      postCopy.description = description;
    }
    if (photoLink) {
      postCopy.photoLink = photoLink;
    }
    if (hashTags) {
      postCopy.hashTags = hashTags;
    }

    if (!PostCollection.validate(postCopy)) {
      return false;
    }

    this._posts[index] = postCopy;
    return true;
  }

  remove(id) {
    const index = this._posts.findIndex(p => p.id === id);
    if (index === -1) {
      return false;
    }

    this._posts.splice(index, 1);
    return true;
  }

  clear() {
    this._posts.length = 0;
  }

  generateId() {
    return `${this._posts.length + 1}`;
  }

  static validate(post) {
    const {
      id,
      description,
      createdAt,
      author,
      photoLink,
      hashTags,
      likes,
    } = post;

    if (!id || !description || description.length > 199 || !createdAt
      || !author || !photoLink || !hashTags || !likes) {
      return false;
    }

    return true;
  }
}

const postCollection = new PostCollection(photoPosts);
