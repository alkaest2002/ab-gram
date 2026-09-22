/**
 * Report generation worker.
 *
 * Receives a plain (non-reactive) snapshot of the sociogram members and builds
 * the report's tabular data. The real computation (sociometric indices,
 * readings and SVGs) will eventually live here; for now it only maps members
 * to the list of names the report needs.
 *
 * Inbound message:  { members: Member[] }
 * Outbound message: { tabularData: { listOfNames: [{ MemberId, MemberName }], graphs: [] } }
 *                   or { error: string } when something went wrong.
 */

self.onmessage = (event) => {
  try {
    const members = event.data?.members ?? [];

    const listOfNames = members.map((member) => ({
      MemberId: member.id,
      MemberName: member.name,
    }));

    const result = {
      tabularData: {
        listOfNames,
        graphs: [],
      },
    };

    self.postMessage(result);
  } catch (error) {
    self.postMessage({
      error: error?.message ?? "Impossibile generare il report.",
    });
  }
};
