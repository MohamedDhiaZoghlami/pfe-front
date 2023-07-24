import React from "react";
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

import Img from "../../assets/logopro.jpg";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: "20px",
  },
  title: {
    fontSize: 24,
    marginBottom: "20px",
    textAlign: "center",
  },
  content: {
    fontSize: 12,
    lineHeight: "2px",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "100px",
    fontSize: 20,
  },
  images: {
    width: "150px",
  },
  detWrapper: {
    marginTop: "50px",
    marginBottom: "50px",
  },
  details: {
    fontSize: 12,
    lineHeight: "2px",
  },
  signature: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: "120px",
  },
  signPartA: {
    fontSize: 16,
    fontWeight: "400",
    marginLeft: "80px",
  },
  signPartB: {
    fontSize: 16,
    fontWeight: "400",
    marginRight: "80px",
  },
});

const ContractPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image src={Img} style={styles.images} />
        <Text>{data.customer.name}</Text>
      </View>
      <View>
        <Text style={styles.title}>{data.name}</Text>
        <Text style={styles.content}>{data.description}</Text>
      </View>
      <View style={styles.detWrapper}>
        <Text style={{ marginBottom: "20px" }}>Important Details :</Text>
        <Text style={styles.details}>Amount : {data.amount}</Text>
        <Text style={styles.details}>Pay bill every : {data.payXmonths}</Text>
        <Text style={styles.details}>Pay total steps : {data.payXsteps}</Text>
        <Text style={styles.details}>
          Fullfilment Date : {data.dateOfFullfillment.split("T")[0]}
        </Text>
      </View>
      <View style={styles.signature}>
        <Text style={styles.signPartA}>Progress Engineer </Text>
        <Text style={styles.signPartB}>{data.customer.name}</Text>
      </View>
    </Page>
  </Document>
);

const DownloadButton = ({ data }) => {
  return (
    <div className="DownBtn">
      <PDFDownloadLink
        document={<ContractPDF data={data} />}
        fileName={`${data.name}.pdf`}
      >
        {({ blob, url, loading, error }) =>
          loading ? "Loading document..." : "Download PDF"
        }
      </PDFDownloadLink>
    </div>
  );
};

export default DownloadButton;
