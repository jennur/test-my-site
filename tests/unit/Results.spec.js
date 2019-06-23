import { shallowMount } from "@vue/test-utils";
import Results from "@/components/Results.vue";

const wrapper = shallowMount(Results);

describe("Results.vue", () => {
  it("renders result section when scores exists", () => {
    wrapper.setProps({ props: { scores: { test: "testing" } } });
    const scores = wrapper.find("ul");
    expect(scores.isVisible()).toBe(true);
  });
});
