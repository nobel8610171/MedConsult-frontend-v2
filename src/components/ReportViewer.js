import '../App.css';
import React from "react";

import { onRenderDocument } from '../functions/Utils';
import { Page, Text, View, Document, StyleSheet, PDFViewer, Font } from '@react-pdf/renderer';

Font.register({
    family: 'NotoSansTC-Regular',
    //   src: 'https://github.com/adobe-fonts/source-han-sans/raw/release/Variable/TTF/SourceHanSansTC-VF.ttf'
    src: 'SourceHanSansTC-VF.ttf'
});

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 12,
		fontFamily: "NotoSansTC-Regular",
        display: "block"
    },
    title: {
        color: "blue",
        fontWeight: "bold",
        paddingBottom: 3,
        marginBottom: 20,
        fontSize: 24,
        textAlign: "center",
        letterSpacing: "2px"
    },
    text: {
        // width: "100px",
        fontSize: 15,
        letterSpacing: "1px",
        lineHeight: "1.5px"
    },
});

const ReportViewer = ({transcriptions, chats, summary}) => {
    const addNewline = (text) => {
        var textLine = ""
        var subline = ""
        const lines =  text.split("\n")
        console.log(lines)
        for (let i = 0; i < lines.length; i++){
            subline = lines[i].match(/.{1,30}/g) ?? [];
            for (let j = 0; j < subline.length; j++){
                textLine += subline[j] + "\n"
            }
        }
        return textLine;
    }
	return (
    <Document >
        <Page size="A4" style={styles.page}>
            <View style={{flexDirection:'column', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                <View style={styles.title}>
                <Text> Consultation history </Text>
                </View>
                <View style={styles.text}>
                <Text>{addNewline(summary)}</Text>
                </View>
            </View>
        </Page>
    </Document>

	)
}

export default ReportViewer;