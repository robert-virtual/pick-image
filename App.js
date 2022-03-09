import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
// import * as ImagePicker from "expo-image-picker";
import {
  StyleSheet,
  TextInput,
  Text,
  Button,
  Image,
  View,
  Platform,
} from "react-native";

export default function App() {
  const [image, setImage] = useState(null);
  const pickImage = async () => {
    let result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      console.log(result);
      const { uri } = result;

      setImage(uri);
    }
  };

  const sendImage = async () => {
    if (!nombre) {
      alert("Debe ingresar su nombre");
      return;
    }

    try {
      let type = image.substring(image.lastIndexOf(".") + 1);

      const body = new FormData();
      body.append("file", {
        name: `${nombre}.${type}`,
        type: `image/${type}`,
        uri: image,
      });
      body.append("nombre", nombre);
      const res = await fetch("http://192.168.0.15:3000/profile", {
        method: "post",
        body,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.ok) {
        alert("Imagen subida");
      }
      const data = await res.json();
      console.log(data.body);
    } catch (error) {
      console.warn(error);
    }
  };
  const [nombre, setNombre] = useState("");
  return (
    <View style={styles.container}>
      <Button title="Seleccionar imagen" onPress={pickImage} />
      <TextInput
        onChangeText={setNombre}
        value={nombre}
        placeholder="Nombre"
        style={{ padding: 5 }}
      />
      {image && (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Image
            source={{ uri: image }}
            style={{ width: 200, height: 200, marginVertical: 20 }}
          />
          <Button title="Subir imagen" onPress={sendImage} />
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
