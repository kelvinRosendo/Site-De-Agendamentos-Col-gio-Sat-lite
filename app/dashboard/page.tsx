import Services from "./Services";
import styles from "./page.module.css";
import Providers from "../providers";
import { createServerPB } from "@/pocketbase/core";
import { setGlobalDispatcher, Agent } from 'undici';

setGlobalDispatcher(new Agent({ connect: { timeout: 60_000 } }));

export default async function Dashboard() {
  const pb = createServerPB();

  const [
    grades,
    classes,
    chromes,
    labs,
    chromeSchedule,
    labSchedule,
    fixed_classes,
  ] = await Promise.all([
    pb.collection("grades").getFullList({ expand: "classes" }),
    pb.collection("classes").getFullList(),
    pb.collection("chrome").getFullList(),
    pb.collection("lab").getFullList(),
    pb.collection("chrome_schedule").getFullList({ filter: "returned = false" }),
    pb.collection("lab_schedule").getFullList({ filter: "returned = false" }),
    pb.collection("fixed_classes").getFullList()
  ]);

  return (
    <div className={`${styles.page}`}>
      <h2>Escolha o serviço</h2>
      <Providers>
        <Services data={{ grades, classes, chromes, labs, speakers: [], chromeSchedule, labSchedule, speakerSchedule: [], fixed_classes }} />
      </Providers>
    </div>
  );
}
