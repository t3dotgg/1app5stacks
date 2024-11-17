import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["battle"];
  storageKey = "battles";

  connect() {
    // console.log('connect');
    const storedData = localStorage.getItem(this.storageKey);
    this.battleQueue = storedData ? JSON.parse(storedData) : [];

    const content = this.element.innerHTML.trim();
    // to avoid duplicating first element when moving back and forth
    if (this.battleQueue.length === 0 || !this._contentsAreEqual(content, this.battleQueue[0])) {
      this.battleQueue.push(content);
    }

    if (this.battleQueue.length === 1) this._preloadNextBattle();

    this._renderBattle();
    // avoid flickering on reload when we replace content with one from the queue
    this.element.classList.remove("hidden");

    window.addEventListener("beforeunload", this._storeBattleQueue.bind(this));
    window.addEventListener("pagehide", this._storeBattleQueue.bind(this));
  }

  disconnect() {
    // console.log('disconnect');
    this._storeBattleQueue();
    window.removeEventListener("beforeunload", this._storeBattleQueue.bind(this));
    window.removeEventListener("pagehide", this._storeBattleQueue.bind(this));
  }

  _storeBattleQueue() {
    // console.log('_storeBattleQueue');
    localStorage.setItem(this.storageKey, JSON.stringify(this.battleQueue));
  }

  clearQueue() {
    console.log("clearQueue");
    this.battleQueue = [];
    localStorage.removeItem(this.storageKey);
  }

  logQueue() {
    console.log("logQueue");
    console.log(this.battleQueue);
  }

  // workaround as we act on mouse down event for a vote (maybe disable turbo)
  handleClick(event) {
    // console.log('handleClick');
    event.preventDefault();
    event.stopPropagation();
  }

  _extractImageSources(content) {
    return Array.from(content.matchAll(/<img[^>]+src="([^">]+)"/g)).map(
      (match) => match[1]
    );
  }

  _contentsAreEqual(content1, content2) {
    const arr1 = this._extractImageSources(content1);
    const arr2 = this._extractImageSources(content2);
    if (arr1.length !== arr2.length) {
      return false;
    }

    return arr1.every((value, index) => value === arr2[index]);
  }

  _renderBattle() {
    // console.log('_renderBattle');
    if (this.battleQueue.length > 0) {
      this.element.innerHTML = this.battleQueue[0];
    }
  }

  _preloadImages(content) {
    // console.log('_preloadImages');
    const imageSources = this._extractImageSources(content);

    imageSources.forEach((src) => {
      const preloader = new Image();
      preloader.src = src;
    });
  }

  async vote(event) {
    // console.log('vote');
    event.preventDefault();
    event.stopPropagation();

    // show new one right away if any
    this.battleQueue.shift();
    this._renderBattle();

    const form = event.target.closest("form");
    if (!form) {
      window.location.reload();
      return;
    }
    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method, headers: { "Accept": "text/html" }, body: formData,
      });

      if (!response.ok) {
        console.error("Vote submission failed:", response.statusText);
        return
      }

      const newContent = await response.text();

      this._preloadImages(newContent);
      this.battleQueue.push(newContent);

      if (this.battleQueue.length === 1) this._renderBattle();
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  }

  _preloadNextBattle() {
    fetch("/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    })
      .then(response => {
        if (!response.ok) {
          console.error("Preload failed:", response.statusText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        this._preloadImages(data.battlefield);
        this.battleQueue.push(data.battlefield);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      })
  }
}
