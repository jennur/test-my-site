import { shallowMount } from "@vue/test-utils";
import TestForm from "@/components/TestForm.vue";

const wrapper = shallowMount(TestForm);

describe("TestForm.vue", () => {
  it("renders props.title when passed", () => {
    wrapper.setProps({ title: "title" });
    const headline = wrapper.find("h1");
    expect(headline.text()).toBe("title");
  });

  it("ckeckboxes emit on-check when checked", () => {
    const checkBoxes = wrapper.find('input[type="checkbox"]');
    checkBoxes.setChecked();
    expect(wrapper.emitted("on-check")).toHaveLength(1);
  });
});
