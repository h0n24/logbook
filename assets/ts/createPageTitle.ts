// change the title of the page - so it doesn't show the url
export function createPageTitle(source: string) {
  // console.log("creating page title", source);

  let url = "";

  source === "presents" ? (url = "Prezence") : (url = url);
  source === "schedulePage" ? (url = "Kalendář") : (url = url);
  source === "news" ? (url = "Novinky") : (url = url);
  source === "students.list" ? (url = "Studenti") : (url = url);
  source === "students.comment" ? (url = "Zpráva pro studenta") : (url = url);
  source === "students.send_mail" ? (url = "Zpráva pro skupinu") : (url = url);
  source === "groupsPage" ? (url = "Skupinová účast") : (url = url);
  source === "bind.materials" ? (url = "Učební pomůcky") : (url = url);
  source === "bind.teach_materials_teach"
    ? (url = "Moje materiály")
    : (url = url);
  source === "traffic" ? (url = "Potenciální ztráty") : (url = url);
  source === "homeWork" ? (url = "Domácí úkoly") : (url = url);
  source === "classWork" ? (url = "Práce v hodině") : (url = url);
  source === "exams" ? (url = "Moje zkoušky") : (url = url);
  source === "report" ? (url = "Reporty") : (url = url);
  source === "tasks" ? (url = "Úkoly") : (url = url);
  source === "content_author" ? (url = "Přidat obsah") : (url = url);

  const title = document.querySelector("title") as HTMLElement;

  if (url) {
    title.innerText = url + " — LogBook";
  } else {
    title.innerText = "LogBook";
  }
}
