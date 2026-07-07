import axios from "axios";
import { ApplicationFormView } from "@/types/application-form";

const BASE_URL = process.env.BACKEND_URL!;
const TOKEN = process.env.AUTHORIZATION!;

const headers = {
  Authorization: TOKEN,
};

const main = async (email: string) => {
  try {
    // const userResponse = await axios.get(
    //   `${BASE_URL}/api/resource/CRM%20Lead`,
    //   {
    //     params: {
    //       fields: JSON.stringify(["*"]),
    //       filters: JSON.stringify([["custom_emailss", "=", email]]),
    //     },
    //     headers,
    //   },
    // );

    // const crmLead = userResponse.data.data?.[0];

    // if (!crmLead) {
    //   console.log(`No CRM Lead found for ${email}`);
    // } else {
    //   console.log(`Found CRM Lead: ${crmLead.name}`);
    // }

    const applicationResponse = await axios.get(
      `${BASE_URL}/api/resource/Application`,
      {
        params: {
          fields: JSON.stringify(["*"]),
          filters: JSON.stringify([["email_id", "=", email]]),
        },
        headers,
      },
    );

    const forms =
      (applicationResponse.data.data as ApplicationFormView[]) || [];

    console.log(`Found ${forms.length} application(s)`);
    for (const form of forms) {
      console.log(`Processing application ${form.name}`);
      try {
        const scholarshipResponse = await axios.get(
          `${BASE_URL}/api/resource/Scholarship`,
          {
            params: {
              fields: JSON.stringify(["*"]),
              filters: JSON.stringify([
                ["application_id__vs_id", "=", form.name],
              ]),
            },
            headers,
          },
        );

        const scholarships = scholarshipResponse.data.data || [];

        console.log(
          `Found ${scholarships.length} scholarship(s) for ${form.name}`,
        );

        for (const scholarship of scholarships) {
          try {
            await axios.delete(
              `${BASE_URL}/api/resource/Scholarship/${scholarship.name}`,
              { headers },
            );

            console.log(
              `✓ Scholarship deleted successfully: ${scholarship.name}`,
            );
          } catch (err: any) {
            console.error(
              `✗ Failed to delete scholarship ${scholarship.name}`,
              err.response?.data || err.message,
            );
          }
        }
      } catch (err: any) {
        console.error(
          `✗ Failed to fetch scholarships for ${form.name}`,
          err.response?.data || err.message,
        );
      }

      try {
        await axios.delete(
          `${BASE_URL}/api/resource/Application/${form.name}`,
          {
            headers,
          },
        );

        console.log(`✓ Application deleted successfully: ${form.name}`);
      } catch (err: any) {
        console.error(
          `✗ Failed to delete application ${form.name}`,
          err.response?.data || err.message,
        );
      }
    }
    try {
      await axios.delete(`${BASE_URL}/api/resource/AcademicDetails/ACD-DET-0041`, {
        headers,
      });

      console.log(`✓ Academics deleted successfully`);
    } catch (err: any) {
      console.error(
        `✗ Failed to delete academic`,
        err.response?.data || err.message,
      );
    }

    //   try {
    //     await axios.delete(
    //       `${BASE_URL}/api/resource/User/${encodeURIComponent(email)}`,
    //       {
    //         headers,
    //       },
    //     );
    //     console.log(`✓ User deleted successfully: ${email}`);
    //   } catch (err: any) {
    //     console.error(
    //       `✗ Failed to delete User ${email}`,
    //       err.response?.data || err.message,
    //     );
    //   }
    //   if (crmLead) {
    //     try {
    //       await axios.delete(
    //         `${BASE_URL}/api/resource/CRM%20Lead/${crmLead.name}`,
    //         {
    //           headers,
    //         },
    //       );

    //       console.log(`✓ CRM Lead deleted successfully: ${crmLead.name}`);
    //     } catch (err: any) {
    //       console.error(
    //         `✗ Failed to delete CRM Lead ${crmLead.name}`,
    //         err.response?.data || err.message,
    //       );
    //     }
    //   }
  } catch (err: any) {
    console.error("Script failed:", err.response?.data || err.message);
  }
};

main("damanjeetsingh434@gmail.com");
