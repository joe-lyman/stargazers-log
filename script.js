const repositoryList = document.querySelector("#repository-list");
const listStatus = document.querySelector("#list-status");

function createRepositoryItem(event) {
  const { repository, starredAt } = event;
  const item = document.createElement("li");
  item.className = "repository-card";

  const title = document.createElement("h3");
  title.className = "repository-title";
  const link = document.createElement("a");
  link.href = repository.url;
  link.textContent = repository.name;
  title.append(link);

  const owner = document.createElement("p");
  owner.className = "repository-owner";
  owner.textContent = `by ${repository.owner}`;

  const description = document.createElement("p");
  description.className = "repository-description";
  description.textContent = repository.description;

  const meta = document.createElement("div");
  meta.className = "repository-meta";

  if (repository.language) {
    const language = document.createElement("span");
    language.className = "repository-language";
    language.textContent = repository.language;
    meta.append(language);
  }

  if (starredAt) {
    const date = document.createElement("time");
    date.dateTime = starredAt;
    date.textContent = `Starred ${new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium"
    }).format(new Date(`${starredAt}T00:00:00`))}`;
    meta.append(date);
  }

  item.append(title, owner, description, meta);
  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Could not load events.json (${response.status}).`);
    }

    const events = await response.json();
    if (!Array.isArray(events)) {
      throw new Error("The repository event data must be a list.");
    }

    const starredRepositories = events.filter(
      (event) => event.type === "starred" && event.repository
    );
    repositoryList.replaceChildren(...starredRepositories.map(createRepositoryItem));
    listStatus.textContent = starredRepositories.length
      ? ""
      : "No starred repositories to show yet.";
  } catch (error) {
    listStatus.dataset.state = "error";
    listStatus.textContent = `Repositories could not be loaded. ${error.message}`;
  }
}

loadRepositories();
