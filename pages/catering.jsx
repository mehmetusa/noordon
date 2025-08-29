import Image from "next/image";
import Head from "next/head";

const Catering = () => {
  return (
    <>
      <Head>
        <title>Catering Services | Your Restaurant</title>
        <meta
          name="description"
          content="Catering services for all occasions. Weddings, parties, corporate events. Delicious Turkish and Mediterranean cuisine."
        />
      </Head>
      <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
        <h1
          style={{
            textAlign: "center",
            fontSize: "2.5rem",
            marginBottom: "1rem",
          }}
        >
          Catering Services
        </h1>

        <Image
          src="/img/catering.jpeg"
          alt="Catering setup"
          width={900}
          height={400}
          style={{
            borderRadius: "12px",
            objectFit: "cover",
            marginBottom: "2rem",
          }}
        />

        <p style={{ fontSize: "1.1rem", lineHeight: "1.7" }}>
          Impress your guests with authentic Turkish cuisine, freshly made and
          beautifully presented. We cater for:
        </p>
        <ul style={{ padding: "1rem 2rem", fontSize: "1.1rem" }}>
          <li>✅ Weddings & Receptions</li>
          <li>✅ Birthday Parties</li>
          <li>✅ Corporate Events</li>
          <li>✅ Private Dinners</li>
        </ul>

        <p style={{ marginTop: "1rem", fontSize: "1.1rem" }}>
          ALL menu is halal.Our customizable menus include options for
          vegetarians, vegans, and special dietary needs.
        </p>

        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h3>📞 Book a Catering Service</h3>
          <p>
            Email: <a href="mailto:info@noordon.com">info@noordon.com</a>
          </p>
          <p>
            Phone: <a href="tel:+1 (202) 844-9087-890">+1 (202) 844-9087</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Catering;
