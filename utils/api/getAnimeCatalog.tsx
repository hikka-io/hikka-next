export default async function getAnimeCatalog({
  query,
}: {
  query?: string | null;
}) {
  const res = await fetch("https://testapi.hikka.io/anime/", {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  return res.json();
}
